export type FrequencyType = 'daily' | 'weekly' | 'days-of-week' | 'times-per-week'

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

export interface Habit {
  id: string
  name: string
  description: string
  frequencyType: FrequencyType
  // For 'days-of-week' frequency
  daysOfWeek?: DayOfWeek[]
  // For 'times-per-week' frequency
  timesPerWeek?: number
  createdAt: string
  // Track completions: date string -> count
  completions: Record<string, number>
}

export interface HabitCompletion {
  habitId: string
  date: string
  count: number
}
