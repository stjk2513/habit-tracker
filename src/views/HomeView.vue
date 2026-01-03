<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import type { RootState } from '../store'

const store = useStore<RootState>()
const router = useRouter()

const todaysHabits = computed(() => store.getters['habits/todaysHabits'])
const totalHabits = computed(() => store.getters['habits/allHabits'].length)

const completedToday = computed(() => {
  return todaysHabits.value.filter((habit: any) =>
    store.getters['habits/isHabitCompleteToday'](habit.id)
  ).length
})

const goToHabits = () => {
  router.push('/habits')
}

const goToAddHabit = () => {
  router.push('/habits/add')
}
</script>

<template>
  <div class="home-view">
    <h1>Welcome to Habit Tracker! 🎉</h1>
    <p class="subtitle">Track your daily habits and build better routines.</p>

    <div class="stats-section">
      <div class="stat-card">
        <div class="stat-number">{{ totalHabits }}</div>
        <div class="stat-label">Total Habits</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ todaysHabits.length }}</div>
        <div class="stat-label">Due Today</div>
      </div>
      <div class="stat-card success">
        <div class="stat-number">{{ completedToday }}</div>
        <div class="stat-label">Completed Today</div>
      </div>
    </div>

    <div class="quick-actions">
      <h2>Quick Actions</h2>
      <div class="actions-grid">
        <button @click="goToHabits" class="action-button">
          <span class="icon">📊</span>
          <span class="action-title">View My Habits</span>
          <span class="action-desc">See all your habits and track progress</span>
        </button>
        <button @click="goToAddHabit" class="action-button">
          <span class="icon">➕</span>
          <span class="action-title">Create New Habit</span>
          <span class="action-desc">Add a new habit to track</span>
        </button>
      </div>
    </div>

    <div class="features-section">
      <h2>Features</h2>
      <ul>
        <li><strong>Multiple Frequencies:</strong> Daily, Weekly, Specific Days, or Times per Week</li>
        <li><strong>Track Progress:</strong> See your streaks and completion history</li>
        <li><strong>LocalStorage:</strong> Your data is saved locally in your browser</li>
        <li><strong>Simple & Clean:</strong> Easy to use interface for habit tracking</li>
      </ul>
    </div>

    <p class="footer-link">
      <router-link to="/about">Learn more about this app</router-link>
    </p>
  </div>
</template>

<style scoped>
.home-view {
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  color: #42b983;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  border: 2px solid #ddd;
  text-align: center;
  transition: all 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.stat-card.success {
  border-color: #42b983;
  background: #f0faf6;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: #42b983;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
}

.quick-actions {
  margin-bottom: 3rem;
}

h2 {
  color: #35495e;
  margin-bottom: 1rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.action-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background: white;
  border: 2px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.action-button:hover {
  border-color: #42b983;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.action-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #35495e;
  margin-bottom: 0.5rem;
}

.action-desc {
  color: #666;
  font-size: 0.9rem;
}

.features-section {
  background: #f5f5f5;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.features-section ul {
  list-style: none;
  padding: 0;
  margin: 1rem 0 0 0;
}

.features-section li {
  padding: 0.75rem 0;
  color: #35495e;
  border-bottom: 1px solid #ddd;
}

.features-section li:last-child {
  border-bottom: none;
}

.footer-link {
  text-align: center;
  margin-top: 2rem;
}

.footer-link a {
  color: #42b983;
  text-decoration: none;
  font-weight: 500;
}

.footer-link a:hover {
  text-decoration: underline;
}
</style>
