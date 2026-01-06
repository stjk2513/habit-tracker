<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import type { RootState } from '../store'
import type { FrequencyType, DayOfWeek, Habit } from '../types/habit'

const store = useStore<RootState>()
const router = useRouter()
const route = useRoute()

const habitId = route.params.id as string

const name = ref('')
const description = ref('')
const frequencyType = ref<FrequencyType>('daily')
const selectedDays = ref<DayOfWeek[]>([])
const timesPerWeek = ref(3)

const allDays: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

onMounted(() => {
  const habit = store.getters['habits/habitById'](habitId) as Habit | undefined
  if (!habit) {
    alert('Habit not found')
    router.push('/habits')
    return
  }

  name.value = habit.name
  description.value = habit.description
  frequencyType.value = habit.frequencyType

  if (habit.daysOfWeek) {
    selectedDays.value = [...habit.daysOfWeek]
  }

  if (habit.timesPerWeek) {
    timesPerWeek.value = habit.timesPerWeek
  }
})

const toggleDay = (day: DayOfWeek) => {
  const index = selectedDays.value.indexOf(day)
  if (index > -1) {
    selectedDays.value.splice(index, 1)
  } else {
    selectedDays.value.push(day)
  }
}

const isDaySelected = (day: DayOfWeek): boolean => {
  return selectedDays.value.includes(day)
}

const getDayLabel = (day: DayOfWeek): string => {
  return day.charAt(0).toUpperCase() + day.slice(1)
}

const handleSubmit = () => {
  if (!name.value.trim()) {
    alert('Please enter a habit name')
    return
  }

  if (frequencyType.value === 'days-of-week' && selectedDays.value.length === 0) {
    alert('Please select at least one day')
    return
  }

  const habit = store.getters['habits/habitById'](habitId) as Habit | undefined
  if (!habit) {
    alert('Habit not found')
    router.push('/habits')
    return
  }

  const updatedHabit: Habit = {
    ...habit,
    name: name.value.trim(),
    description: description.value.trim(),
    frequencyType: frequencyType.value,
    daysOfWeek: frequencyType.value === 'days-of-week' ? selectedDays.value : undefined,
    timesPerWeek: frequencyType.value === 'times-per-week' ? timesPerWeek.value : undefined
  }

  store.dispatch('habits/updateHabit', updatedHabit)
  router.push('/habits')
}

const cancel = () => {
  router.push('/habits')
}
</script>

<template>
  <div class="edit-habit-view">
    <h1>Edit Habit</h1>

    <form @submit.prevent="handleSubmit" class="habit-form">
      <div class="form-group">
        <label for="name">Habit Name *</label>
        <input
          id="name"
          v-model="name"
          type="text"
          placeholder="e.g., Morning Exercise"
          class="form-input"
          required
        />
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <textarea
          id="description"
          v-model="description"
          placeholder="What does this habit involve?"
          class="form-textarea"
          rows="3"
        ></textarea>
      </div>

      <div class="form-group">
        <label>Frequency *</label>
        <div class="frequency-options">
          <label class="radio-option">
            <input
              type="radio"
              v-model="frequencyType"
              value="daily"
            />
            <span>Daily</span>
          </label>

          <label class="radio-option">
            <input
              type="radio"
              v-model="frequencyType"
              value="weekly"
            />
            <span>Weekly</span>
          </label>

          <label class="radio-option">
            <input
              type="radio"
              v-model="frequencyType"
              value="days-of-week"
            />
            <span>Specific Days</span>
          </label>

          <label class="radio-option">
            <input
              type="radio"
              v-model="frequencyType"
              value="times-per-week"
            />
            <span>Times per Week</span>
          </label>
        </div>
      </div>

      <div v-if="frequencyType === 'days-of-week'" class="form-group">
        <label>Select Days *</label>
        <div class="days-selector">
          <button
            v-for="day in allDays"
            :key="day"
            type="button"
            @click="toggleDay(day)"
            class="day-button"
            :class="{ selected: isDaySelected(day) }"
          >
            {{ getDayLabel(day) }}
          </button>
        </div>
      </div>

      <div v-if="frequencyType === 'times-per-week'" class="form-group">
        <label for="times">Times per Week *</label>
        <div class="number-input-group">
          <button
            type="button"
            @click="timesPerWeek = Math.max(1, timesPerWeek - 1)"
            class="btn-adjust"
          >
            -
          </button>
          <input
            id="times"
            v-model.number="timesPerWeek"
            type="number"
            min="1"
            max="7"
            class="form-input-number"
          />
          <button
            type="button"
            @click="timesPerWeek = Math.min(7, timesPerWeek + 1)"
            class="btn-adjust"
          >
            +
          </button>
        </div>
      </div>

      <div class="form-actions">
        <button type="button" @click="cancel" class="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" class="btn btn-primary">
          Save Changes
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.edit-habit-view {
  max-width: 600px;
  margin: 0 auto;
}

h1 {
  color: #42b983;
  margin-bottom: 2rem;
}

.habit-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #35495e;
  font-weight: 500;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
  box-sizing: border-box;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #42b983;
}

.form-textarea {
  resize: vertical;
}

.frequency-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.radio-option:hover {
  border-color: #42b983;
  background: #f9f9f9;
}

.radio-option input[type="radio"] {
  cursor: pointer;
}

.radio-option span {
  font-weight: 500;
}

.days-selector {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 0.5rem;
}

.day-button {
  padding: 0.75rem;
  border: 2px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.day-button:hover {
  border-color: #42b983;
}

.day-button.selected {
  background: #42b983;
  color: white;
  border-color: #42b983;
}

.number-input-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  max-width: 200px;
}

.form-input-number {
  flex: 1;
  text-align: center;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-input-number:focus {
  outline: none;
  border-color: #42b983;
}

.btn-adjust {
  width: 40px;
  height: 40px;
  border: 2px solid #42b983;
  background: white;
  color: #42b983;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: bold;
  transition: all 0.2s;
}

.btn-adjust:hover {
  background: #42b983;
  color: white;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
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

/* Remove number input arrows in Chrome, Safari, Edge */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Remove number input arrows in Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
