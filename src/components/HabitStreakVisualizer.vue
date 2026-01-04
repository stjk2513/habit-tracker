<script setup lang="ts">
import { computed } from 'vue'
import type { Habit } from '../types/habit'

interface Props {
  habit: Habit
  weeks?: number
}

const props = withDefaults(defineProps<Props>(), {
  weeks: 20
})

interface DayData {
  date: string
  count: number
  dayOfWeek: number
  weekIndex: number
}

// Generate grid data for the last N weeks
const gridData = computed(() => {
  const today = new Date()
  const endDate = new Date(today)

  // Calculate start date (N weeks ago from today)
  const startDate = new Date(today)
  startDate.setDate(startDate.getDate() - (props.weeks * 7) + 1)

  // Align to Sunday (start of week)
  const startDayOfWeek = startDate.getDay()
  startDate.setDate(startDate.getDate() - startDayOfWeek)

  const days: DayData[] = []
  const currentDate = new Date(startDate)
  let weekIndex = 0

  // Generate all days from start to end
  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split('T')[0] as string
    const dayOfWeek = currentDate.getDay()

    // Move to next week when we hit Sunday (except for the first day)
    if (dayOfWeek === 0 && days.length > 0) {
      weekIndex++
    }

    days.push({
      date: dateStr,
      count: (props.habit.completions as Record<string, number>)[dateStr] || 0,
      dayOfWeek,
      weekIndex
    })

    currentDate.setDate(currentDate.getDate() + 1)
  }

  return days
})

// Group days by week for rendering
const weeklyData = computed(() => {
  const weeks: DayData[][] = []

  gridData.value.forEach(day => {
    if (!weeks[day.weekIndex]) {
      weeks[day.weekIndex] = []
    }
    weeks[day.weekIndex]!.push(day)
  })

  return weeks.filter(week => week && week.length > 0)
})

// Get color intensity based on completion count
const getColor = (count: number): string => {
  if (count === 0) return '#ebedf0'
  if (count === 1) return '#9be9a8'
  if (count === 2) return '#40c463'
  if (count === 3) return '#30a14e'
  return '#216e39'
}

const getTooltip = (day: DayData): string => {
  const date = new Date(day.date)
  const dateStr = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })

  if (day.count === 0) {
    return `${dateStr}: No completions`
  } else if (day.count === 1) {
    return `${dateStr}: 1 completion`
  } else {
    return `${dateStr}: ${day.count} completions`
  }
}

// Month labels
const monthLabels = computed(() => {
  const labels: { month: string; weekIndex: number }[] = []
  let lastMonth = -1

  weeklyData.value.forEach((week, index) => {
    const firstDay = week[0]
    if (firstDay) {
      const date = new Date(firstDay.date)
      const month = date.getMonth()

      if (month !== lastMonth) {
        labels.push({
          month: date.toLocaleDateString('en-US', { month: 'short' }),
          weekIndex: index
        })
        lastMonth = month
      }
    }
  })

  return labels
})
</script>

<template>
  <div class="streak-visualizer">
    <div class="visualizer-header">
      <h3>{{ habit.name }} - Activity</h3>
    </div>

    <div class="grid-container">
      <div class="month-labels">
        <div
          v-for="label in monthLabels"
          :key="label.weekIndex"
          class="month-label"
          :style="{ gridColumn: label.weekIndex + 1 }"
        >
          {{ label.month }}
        </div>
      </div>

      <div class="day-labels">
        <div class="day-label" style="grid-row: 2;">Mon</div>
        <div class="day-label" style="grid-row: 4;">Wed</div>
        <div class="day-label" style="grid-row: 6;">Fri</div>
      </div>

      <div class="grid">
        <div
          v-for="week in weeklyData"
          :key="week[0]?.date"
          class="week-column"
        >
          <div
            v-for="day in week"
            :key="day.date"
            class="day-cell"
            :style="{
              backgroundColor: getColor(day.count),
              gridRow: day.dayOfWeek + 1
            }"
            :title="getTooltip(day)"
          ></div>
        </div>
      </div>
    </div>

    <div class="legend">
      <span class="legend-label">Less</span>
      <div class="legend-colors">
        <div class="legend-cell" :style="{ backgroundColor: '#ebedf0' }"></div>
        <div class="legend-cell" :style="{ backgroundColor: '#9be9a8' }"></div>
        <div class="legend-cell" :style="{ backgroundColor: '#40c463' }"></div>
        <div class="legend-cell" :style="{ backgroundColor: '#30a14e' }"></div>
        <div class="legend-cell" :style="{ backgroundColor: '#216e39' }"></div>
      </div>
      <span class="legend-label">More</span>
    </div>
  </div>
</template>

<style scoped>
.streak-visualizer {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1rem 0;
}

.visualizer-header {
  margin-bottom: 1rem;
}

.visualizer-header h3 {
  margin: 0;
  color: #35495e;
  font-size: 1.1rem;
}

.grid-container {
  position: relative;
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding: 1rem 0 1rem 3rem;
}

.month-labels {
  position: absolute;
  top: 0;
  left: 3rem;
  right: 0;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 12px;
  gap: 3px;
  font-size: 0.7rem;
  color: #666;
}

.month-label {
  text-align: left;
}

.day-labels {
  position: absolute;
  left: 0;
  top: 1rem;
  display: grid;
  grid-template-rows: repeat(7, 12px);
  gap: 3px;
  font-size: 0.7rem;
  color: #666;
}

.day-label {
  text-align: right;
  padding-right: 0.5rem;
  line-height: 12px;
}

.grid {
  display: flex;
  gap: 3px;
}

.week-column {
  display: grid;
  grid-template-rows: repeat(7, 12px);
  gap: 3px;
}

.day-cell {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.1s;
}

.day-cell:hover {
  outline: 2px solid rgba(0, 0, 0, 0.3);
  outline-offset: 0;
}

.legend {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
  font-size: 0.75rem;
  color: #666;
}

.legend-label {
  font-size: 0.7rem;
}

.legend-colors {
  display: flex;
  gap: 3px;
}

.legend-cell {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}
</style>
