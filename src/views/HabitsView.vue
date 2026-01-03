<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import type { RootState } from '../store'
import type { Habit } from '../types/habit'

const store = useStore<RootState>()
const router = useRouter()

const todaysHabits = computed<Habit[]>(() => store.getters['habits/todaysHabits'])
const allHabits = computed<Habit[]>(() => store.getters['habits/allHabits'])

const getCompletionToday = (habitId: string): number => {
  return store.getters['habits/habitCompletionToday'](habitId)
}

const getCompletionThisWeek = (habitId: string): number => {
  return store.getters['habits/habitCompletionThisWeek'](habitId)
}

const isCompleteToday = (habitId: string): boolean => {
  return store.getters['habits/isHabitCompleteToday'](habitId)
}

const getStats = (habitId: string) => {
  return store.getters['habits/habitStats'](habitId)
}

const completeHabit = (habitId: string) => {
  store.dispatch('habits/completeHabit', habitId)
}

const uncompleteHabit = (habitId: string) => {
  store.dispatch('habits/uncompleteHabit', habitId)
}

const deleteHabit = (habitId: string) => {
  if (confirm('Are you sure you want to delete this habit?')) {
    store.dispatch('habits/deleteHabit', habitId)
  }
}

const goToAddHabit = () => {
  router.push('/habits/add')
}

const getFrequencyDisplay = (habit: Habit): string => {
  switch (habit.frequencyType) {
    case 'daily':
      return 'Daily'
    case 'weekly':
      return 'Weekly'
    case 'days-of-week':
      return habit.daysOfWeek?.map(d => d.charAt(0).toUpperCase() + d.slice(1, 3)).join(', ') || ''
    case 'times-per-week':
      return `${habit.timesPerWeek}x per week`
    default:
      return ''
  }
}

const getProgressForHabit = (habit: Habit): { current: number; target: number } => {
  if (habit.frequencyType === 'times-per-week') {
    return {
      current: getCompletionThisWeek(habit.id),
      target: habit.timesPerWeek || 0
    }
  }
  return {
    current: getCompletionToday(habit.id),
    target: 1
  }
}
</script>

<template>
  <div class="habits-view">
    <div class="header">
      <h1>My Habits</h1>
      <button @click="goToAddHabit" class="btn btn-primary">+ Add Habit</button>
    </div>

    <div v-if="allHabits.length === 0" class="empty-state">
      <p>No habits yet. Create your first habit to get started!</p>
      <button @click="goToAddHabit" class="btn btn-primary">Create Habit</button>
    </div>

    <div v-else class="habits-section">
      <h2>Today's Habits</h2>

      <div v-if="todaysHabits.length === 0" class="info-message">
        <p>No habits scheduled for today.</p>
      </div>

      <div v-else class="habits-list">
        <div
          v-for="habit in todaysHabits"
          :key="habit.id"
          class="habit-card"
          :class="{ completed: isCompleteToday(habit.id) }"
        >
          <div class="habit-main">
            <div class="habit-info">
              <h3>{{ habit.name }}</h3>
              <p class="description">{{ habit.description }}</p>
              <div class="meta">
                <span class="frequency">{{ getFrequencyDisplay(habit) }}</span>
                <span class="stats">
                  Streak: {{ getStats(habit.id)?.currentStreak || 0 }} days
                </span>
              </div>
            </div>

            <div class="habit-actions">
              <div class="progress-info">
                <span class="progress-text">
                  {{ getProgressForHabit(habit).current }} / {{ getProgressForHabit(habit).target }}
                </span>
              </div>

              <div class="buttons">
                <button
                  v-if="getCompletionToday(habit.id) > 0"
                  @click="uncompleteHabit(habit.id)"
                  class="btn btn-small btn-secondary"
                >
                  -
                </button>
                <button
                  @click="completeHabit(habit.id)"
                  class="btn btn-small"
                  :class="isCompleteToday(habit.id) ? 'btn-success' : 'btn-primary'"
                >
                  ✓
                </button>
                <button
                  @click="deleteHabit(habit.id)"
                  class="btn btn-small btn-danger"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2 style="margin-top: 2rem">All Habits ({{ allHabits.length }})</h2>
      <div class="habits-list compact">
        <div
          v-for="habit in allHabits"
          :key="habit.id"
          class="habit-card-compact"
        >
          <div class="habit-compact-info">
            <span class="habit-name">{{ habit.name }}</span>
            <span class="habit-frequency">{{ getFrequencyDisplay(habit) }}</span>
          </div>
          <button
            @click="deleteHabit(habit.id)"
            class="btn-delete-compact"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.habits-view {
  max-width: 800px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

h1 {
  color: #42b983;
  margin: 0;
}

h2 {
  color: #35495e;
  margin-bottom: 1rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  background: #f5f5f5;
  border-radius: 8px;
}

.empty-state p {
  color: #666;
  margin-bottom: 1.5rem;
}

.info-message {
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 4px;
  text-align: center;
  color: #666;
}

.habits-section {
  margin-bottom: 2rem;
}

.habits-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.habit-card {
  background: white;
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.2s;
}

.habit-card.completed {
  border-color: #42b983;
  background: #f0faf6;
}

.habit-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.habit-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.habit-info {
  flex: 1;
}

.habit-info h3 {
  margin: 0 0 0.5rem 0;
  color: #35495e;
}

.description {
  margin: 0 0 0.5rem 0;
  color: #666;
  font-size: 0.9rem;
}

.meta {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: #888;
}

.frequency {
  font-weight: 500;
  color: #42b983;
}

.habit-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.progress-info {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.buttons {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  font-size: 1rem;
}

.btn-small {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.btn-primary {
  background: #42b983;
  color: white;
}

.btn-primary:hover {
  background: #359268;
}

.btn-secondary {
  background: #95a5a6;
  color: white;
}

.btn-secondary:hover {
  background: #7f8c8d;
}

.btn-success {
  background: #27ae60;
  color: white;
}

.btn-success:hover {
  background: #229954;
}

.btn-danger {
  background: #e74c3c;
  color: white;
}

.btn-danger:hover {
  background: #c0392b;
}

.habits-list.compact {
  gap: 0.5rem;
}

.habit-card-compact {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  transition: all 0.2s;
}

.habit-card-compact:hover {
  border-color: #42b983;
  background: #f9f9f9;
}

.habit-compact-info {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.habit-name {
  font-weight: 500;
  color: #35495e;
}

.habit-frequency {
  font-size: 0.85rem;
  color: #888;
}

.btn-delete-compact {
  width: 24px;
  height: 24px;
  border: none;
  background: #e74c3c;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  line-height: 1;
  padding: 0;
  transition: all 0.2s;
}

.btn-delete-compact:hover {
  background: #c0392b;
  transform: scale(1.1);
}
</style>
