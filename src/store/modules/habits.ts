import type { Module } from 'vuex'
import type { RootState } from '../index'
import type { Habit, DayOfWeek, FrequencyType } from '../../types/habit'

export interface HabitsState {
  habits: Habit[]
}

const STORAGE_KEY = 'habit-tracker-habits'

// Load habits from localStorage
const loadHabits = (): Habit[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error loading habits from localStorage:', error)
    return []
  }
}

// Save habits to localStorage
const saveHabits = (habits: Habit[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits))
  } catch (error) {
    console.error('Error saving habits to localStorage:', error)
  }
}

// Get today's date in YYYY-MM-DD format
const getTodayString = (): string => {
  const today = new Date()
  const result = today.toISOString().split('T')[0]
  return result!
}

// Get current day of week
const getCurrentDayOfWeek = (): DayOfWeek => {
  const days: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  return days[new Date().getDay()]!
}

// Get start of current week (Monday)
const getWeekStart = (date: Date = new Date()): string => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
  d.setDate(diff)
  const result = d.toISOString().split('T')[0]
  return result!
}

const habitsModule: Module<HabitsState, RootState> = {
  namespaced: true,

  state: {
    habits: loadHabits()
  },

  getters: {
    allHabits: (state) => state.habits,

    habitById: (state) => (id: string) => {
      return state.habits.find(h => h.id === id)
    },

    todaysHabits: (state) => {
      const today = getCurrentDayOfWeek()
      return state.habits.filter(habit => {
        if (habit.frequencyType === 'daily') return true
        if (habit.frequencyType === 'weekly') return true
        if (habit.frequencyType === 'times-per-week') return true
        if (habit.frequencyType === 'days-of-week') {
          return habit.daysOfWeek?.includes(today) ?? false
        }
        return false
      })
    },

    habitCompletionToday: (state) => (habitId: string) => {
      const habit = state.habits.find(h => h.id === habitId)
      const today = getTodayString()
      return habit?.completions[today] ?? 0
    },

    habitCompletionThisWeek: (state) => (habitId: string) => {
      const habit = state.habits.find(h => h.id === habitId)
      if (!habit) return 0

      const weekStart = getWeekStart()
      const weekStartDate = new Date(weekStart)
      let total = 0

      for (let i = 0; i < 7; i++) {
        const date = new Date(weekStartDate)
        date.setDate(date.getDate() + i)
        const dateStr = date.toISOString().split('T')[0]!
        total += habit.completions[dateStr] ?? 0
      }

      return total
    },

    isHabitCompleteToday: (state) => (habitId: string) => {
      const habit = state.habits.find(h => h.id === habitId)
      if (!habit) return false

      const today = getTodayString()
      const completionCount = habit.completions[today] ?? 0

      if (habit.frequencyType === 'daily') return completionCount >= 1
      if (habit.frequencyType === 'weekly') return completionCount >= 1
      if (habit.frequencyType === 'days-of-week') return completionCount >= 1

      return false
    },

    habitStats: (state) => (habitId: string) => {
      const habit = state.habits.find(h => h.id === habitId)
      if (!habit) return null

      const totalCompletions = Object.values(habit.completions).reduce((sum, count) => sum + count, 0)
      const daysTracked = Object.keys(habit.completions).length
      const currentStreak = calculateStreak(habit)

      return {
        totalCompletions,
        daysTracked,
        currentStreak
      }
    }
  },

  mutations: {
    SET_HABITS(state, habits: Habit[]) {
      state.habits = habits
      saveHabits(habits)
    },

    ADD_HABIT(state, habit: Habit) {
      state.habits.push(habit)
      saveHabits(state.habits)
    },

    UPDATE_HABIT(state, habit: Habit) {
      const index = state.habits.findIndex(h => h.id === habit.id)
      if (index > -1) {
        state.habits[index] = habit
        saveHabits(state.habits)
      }
    },

    DELETE_HABIT(state, habitId: string) {
      state.habits = state.habits.filter(h => h.id !== habitId)
      saveHabits(state.habits)
    },

    COMPLETE_HABIT(state, { habitId, date }: { habitId: string; date: string }) {
      const habit = state.habits.find(h => h.id === habitId)
      if (habit) {
        if (!habit.completions[date]) {
          habit.completions[date] = 0
        }
        habit.completions[date]++
        saveHabits(state.habits)
      }
    },

    UNCOMPLETE_HABIT(state, { habitId, date }: { habitId: string; date: string }) {
      const habit = state.habits.find(h => h.id === habitId)
      if (habit && habit.completions[date] && habit.completions[date] > 0) {
        habit.completions[date]--
        if (habit.completions[date] === 0) {
          delete habit.completions[date]
        }
        saveHabits(state.habits)
      }
    }
  },

  actions: {
    addHabit({ commit }, payload: {
      name: string
      description: string
      frequencyType: FrequencyType
      daysOfWeek?: DayOfWeek[]
      timesPerWeek?: number
    }) {
      const habit: Habit = {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 11),
        name: payload.name,
        description: payload.description,
        frequencyType: payload.frequencyType,
        daysOfWeek: payload.daysOfWeek,
        timesPerWeek: payload.timesPerWeek,
        createdAt: new Date().toISOString(),
        completions: {}
      }
      commit('ADD_HABIT', habit)
    },

    updateHabit({ commit }, habit: Habit) {
      commit('UPDATE_HABIT', habit)
    },

    deleteHabit({ commit }, habitId: string) {
      commit('DELETE_HABIT', habitId)
    },

    completeHabit({ commit }, habitId: string) {
      const today = getTodayString()
      commit('COMPLETE_HABIT', { habitId, date: today })
    },

    uncompleteHabit({ commit }, habitId: string) {
      const today = getTodayString()
      commit('UNCOMPLETE_HABIT', { habitId, date: today })
    }
  }
}

// Helper function to calculate streak
function calculateStreak(habit: Habit): number {
  const dates = Object.keys(habit.completions).sort().reverse()
  if (dates.length === 0) return 0

  const today = getTodayString()
  let streak = 0
  let currentDate = new Date(today)

  for (let i = 0; i < 365; i++) { // Max check 1 year
    const dateStr = currentDate.toISOString().split('T')[0]!

    if (habit.completions[dateStr] && habit.completions[dateStr] > 0) {
      streak++
    } else {
      // Allow today to not be completed yet
      if (dateStr !== today) break
    }

    currentDate.setDate(currentDate.getDate() - 1)
  }

  return streak
}

export default habitsModule
