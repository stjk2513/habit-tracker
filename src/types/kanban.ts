export interface KanbanCard {
  id: string
  title: string
  description: string
  columnId: string
  order: number
  createdAt: string
}

export interface KanbanColumn {
  id: string
  title: string
  order: number
  color: string
}

export type ColumnId = 'todo' | 'in-progress' | 'done'
