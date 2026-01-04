import type { Module } from 'vuex'
import type { RootState } from '../index'
import type { KanbanCard, KanbanColumn } from '../../types/kanban'

export interface KanbanState {
  columns: KanbanColumn[]
  cards: KanbanCard[]
}

const STORAGE_KEY = 'habit-tracker-kanban'

const loadKanbanData = (): KanbanState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Error loading kanban data from localStorage:', error)
  }

  // Default columns
  return {
    columns: [
      { id: 'todo', title: 'To Do', order: 0, color: '#e74c3c' },
      { id: 'in-progress', title: 'In Progress', order: 1, color: '#f39c12' },
      { id: 'done', title: 'Done', order: 2, color: '#27ae60' }
    ],
    cards: []
  }
}

const saveKanbanData = (state: KanbanState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (error) {
    console.error('Error saving kanban data to localStorage:', error)
  }
}

const kanbanModule: Module<KanbanState, RootState> = {
  namespaced: true,

  state: loadKanbanData(),

  getters: {
    columns: (state) => state.columns.sort((a, b) => a.order - b.order),

    cardsByColumn: (state) => (columnId: string) => {
      return state.cards
        .filter(card => card.columnId === columnId)
        .sort((a, b) => a.order - b.order)
    },

    allCards: (state) => state.cards
  },

  mutations: {
    ADD_CARD(state, card: KanbanCard) {
      state.cards.push(card)
      saveKanbanData(state)
    },

    UPDATE_CARD(state, updatedCard: KanbanCard) {
      const index = state.cards.findIndex(card => card.id === updatedCard.id)
      if (index > -1) {
        state.cards[index] = updatedCard
        saveKanbanData(state)
      }
    },

    DELETE_CARD(state, cardId: string) {
      state.cards = state.cards.filter(card => card.id !== cardId)
      saveKanbanData(state)
    },

    MOVE_CARD(state, { cardId, newColumnId, newOrder }: { cardId: string; newColumnId: string; newOrder: number }) {
      const card = state.cards.find(c => c.id === cardId)
      if (!card) return

      const oldColumnId = card.columnId

      // Update the card's column
      card.columnId = newColumnId
      card.order = newOrder

      // Reorder cards in the new column
      state.cards
        .filter(c => c.columnId === newColumnId && c.id !== cardId)
        .forEach((c, index) => {
          if (index >= newOrder) {
            c.order = index + 1
          } else {
            c.order = index
          }
        })

      // Reorder cards in the old column if it's different
      if (oldColumnId !== newColumnId) {
        state.cards
          .filter(c => c.columnId === oldColumnId)
          .forEach((c, index) => {
            c.order = index
          })
      }

      saveKanbanData(state)
    },

    ADD_COLUMN(state, column: KanbanColumn) {
      state.columns.push(column)
      saveKanbanData(state)
    },

    UPDATE_COLUMN(state, updatedColumn: KanbanColumn) {
      const index = state.columns.findIndex(col => col.id === updatedColumn.id)
      if (index > -1) {
        state.columns[index] = updatedColumn
        saveKanbanData(state)
      }
    },

    DELETE_COLUMN(state, columnId: string) {
      state.columns = state.columns.filter(col => col.id !== columnId)
      // Also delete all cards in this column
      state.cards = state.cards.filter(card => card.columnId !== columnId)
      saveKanbanData(state)
    }
  },

  actions: {
    addCard({ commit, state }, payload: { title: string; description: string; columnId: string }) {
      const cardsInColumn = state.cards.filter(card => card.columnId === payload.columnId)
      const newOrder = cardsInColumn.length

      const card: KanbanCard = {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 11),
        title: payload.title,
        description: payload.description,
        columnId: payload.columnId,
        order: newOrder,
        createdAt: new Date().toISOString()
      }

      commit('ADD_CARD', card)
    },

    updateCard({ commit }, card: KanbanCard) {
      commit('UPDATE_CARD', card)
    },

    deleteCard({ commit }, cardId: string) {
      commit('DELETE_CARD', cardId)
    },

    moveCard({ commit }, payload: { cardId: string; newColumnId: string; newOrder: number }) {
      commit('MOVE_CARD', payload)
    },

    addColumn({ commit, state }, payload: { title: string; color: string }) {
      const column: KanbanColumn = {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 11),
        title: payload.title,
        order: state.columns.length,
        color: payload.color
      }

      commit('ADD_COLUMN', column)
    },

    updateColumn({ commit }, column: KanbanColumn) {
      commit('UPDATE_COLUMN', column)
    },

    deleteColumn({ commit }, columnId: string) {
      commit('DELETE_COLUMN', columnId)
    }
  }
}

export default kanbanModule
