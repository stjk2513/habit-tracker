<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import type { RootState } from '../store'
import type { KanbanCard, KanbanColumn } from '../types/kanban'

const store = useStore<RootState>()

const columns = computed<KanbanColumn[]>(() => store.getters['kanban/columns'])
const getCardsByColumn = (columnId: string): KanbanCard[] => {
  return store.getters['kanban/cardsByColumn'](columnId)
}

// Drag and drop state
const draggedCard = ref<KanbanCard | null>(null)
const draggedOverColumn = ref<string | null>(null)

// New card form
const showAddCardForm = ref<string | null>(null)
const newCardTitle = ref('')
const newCardDescription = ref('')

const startDrag = (card: KanbanCard) => {
  draggedCard.value = card
}

const onDragOver = (event: DragEvent, columnId: string) => {
  event.preventDefault()
  draggedOverColumn.value = columnId
}

const onDragLeave = () => {
  draggedOverColumn.value = null
}

const onDrop = (event: DragEvent, columnId: string) => {
  event.preventDefault()

  if (!draggedCard.value) return

  const cardsInColumn = getCardsByColumn(columnId)
  const newOrder = cardsInColumn.length

  store.dispatch('kanban/moveCard', {
    cardId: draggedCard.value.id,
    newColumnId: columnId,
    newOrder
  })

  draggedCard.value = null
  draggedOverColumn.value = null
}

const openAddCardForm = (columnId: string) => {
  showAddCardForm.value = columnId
  newCardTitle.value = ''
  newCardDescription.value = ''
}

const cancelAddCard = () => {
  showAddCardForm.value = null
  newCardTitle.value = ''
  newCardDescription.value = ''
}

const addCard = (columnId: string) => {
  if (!newCardTitle.value.trim()) return

  store.dispatch('kanban/addCard', {
    title: newCardTitle.value,
    description: newCardDescription.value,
    columnId
  })

  cancelAddCard()
}

const deleteCard = (cardId: string) => {
  if (confirm('Are you sure you want to delete this card?')) {
    store.dispatch('kanban/deleteCard', cardId)
  }
}

const editCard = ref<string | null>(null)
const editCardTitle = ref('')
const editCardDescription = ref('')

const startEditCard = (card: KanbanCard) => {
  editCard.value = card.id
  editCardTitle.value = card.title
  editCardDescription.value = card.description
}

const saveEditCard = (card: KanbanCard) => {
  store.dispatch('kanban/updateCard', {
    ...card,
    title: editCardTitle.value,
    description: editCardDescription.value
  })
  editCard.value = null
}

const cancelEditCard = () => {
  editCard.value = null
}
</script>

<template>
  <div class="kanban-view">
    <div class="header">
      <h1>Kanban Board</h1>
    </div>

    <div class="kanban-board">
      <div
        v-for="column in columns"
        :key="column.id"
        class="kanban-column"
        :class="{ 'drag-over': draggedOverColumn === column.id }"
        @dragover="onDragOver($event, column.id)"
        @dragleave="onDragLeave"
        @drop="onDrop($event, column.id)"
      >
        <div class="column-header" :style="{ borderTopColor: column.color }">
          <h2>{{ column.title }}</h2>
          <span class="card-count">{{ getCardsByColumn(column.id).length }}</span>
        </div>

        <div class="cards-container">
          <div
            v-for="card in getCardsByColumn(column.id)"
            :key="card.id"
            class="kanban-card"
            draggable="true"
            @dragstart="startDrag(card)"
          >
            <div v-if="editCard === card.id" class="edit-card-form">
              <input
                v-model="editCardTitle"
                type="text"
                class="input"
                placeholder="Card title"
                @keyup.enter="saveEditCard(card)"
                @keyup.esc="cancelEditCard"
              />
              <textarea
                v-model="editCardDescription"
                class="textarea"
                placeholder="Description"
                rows="3"
                @keyup.esc="cancelEditCard"
              ></textarea>
              <div class="form-buttons">
                <button @click="saveEditCard(card)" class="btn btn-primary btn-small">Save</button>
                <button @click="cancelEditCard" class="btn btn-secondary btn-small">Cancel</button>
              </div>
            </div>

            <div v-else>
              <h3 class="card-title">{{ card.title }}</h3>
              <p v-if="card.description" class="card-description">{{ card.description }}</p>
              <div class="card-actions">
                <button @click="startEditCard(card)" class="btn-icon" title="Edit">✎</button>
                <button @click="deleteCard(card.id)" class="btn-icon btn-danger" title="Delete">×</button>
              </div>
            </div>
          </div>

          <div v-if="showAddCardForm === column.id" class="add-card-form">
            <input
              v-model="newCardTitle"
              type="text"
              class="input"
              placeholder="Card title"
              @keyup.enter="addCard(column.id)"
              @keyup.esc="cancelAddCard"
              autofocus
            />
            <textarea
              v-model="newCardDescription"
              class="textarea"
              placeholder="Description (optional)"
              rows="3"
              @keyup.esc="cancelAddCard"
            ></textarea>
            <div class="form-buttons">
              <button @click="addCard(column.id)" class="btn btn-primary btn-small">Add Card</button>
              <button @click="cancelAddCard" class="btn btn-secondary btn-small">Cancel</button>
            </div>
          </div>

          <button
            v-else
            @click="openAddCardForm(column.id)"
            class="btn-add-card"
          >
            + Add Card
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kanban-view {
  max-width: 1400px;
  margin: 0 auto;
  height: calc(100vh - 4rem);
  display: flex;
  flex-direction: column;
}

.header {
  margin-bottom: 1.5rem;
}

h1 {
  color: #42b983;
  margin: 0;
}

.kanban-board {
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  flex: 1;
  padding-bottom: 1rem;
}

.kanban-column {
  min-width: 320px;
  background: #f5f5f5;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  max-height: 100%;
  transition: background-color 0.2s;
}

.kanban-column.drag-over {
  background: #e8f5e9;
}

.column-header {
  padding: 1rem;
  border-top: 4px solid;
  border-radius: 8px 8px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
}

.column-header h2 {
  margin: 0;
  font-size: 1.1rem;
  color: #35495e;
}

.card-count {
  background: #ddd;
  color: #666;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
}

.cards-container {
  padding: 1rem;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.kanban-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 1rem;
  cursor: move;
  transition: all 0.2s;
  position: relative;
}

.kanban-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.kanban-card:hover .card-actions {
  opacity: 1;
}

.card-title {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  color: #35495e;
  word-wrap: break-word;
}

.card-description {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
  line-height: 1.4;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.card-actions {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: flex;
  gap: 0.25rem;
  opacity: 0;
  transition: opacity 0.2s;
}

.btn-icon {
  width: 24px;
  height: 24px;
  border: none;
  background: #95a5a6;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: #7f8c8d;
}

.btn-icon.btn-danger {
  background: #e74c3c;
  font-size: 1.2rem;
}

.btn-icon.btn-danger:hover {
  background: #c0392b;
}

.btn-add-card {
  width: 100%;
  padding: 0.75rem;
  border: 2px dashed #ddd;
  background: transparent;
  color: #666;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-add-card:hover {
  border-color: #42b983;
  color: #42b983;
  background: white;
}

.add-card-form,
.edit-card-form {
  background: white;
  border: 2px solid #42b983;
  border-radius: 6px;
  padding: 1rem;
}

.input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  font-family: inherit;
}

.input:focus {
  outline: none;
  border-color: #42b983;
}

.textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  font-family: inherit;
  resize: vertical;
}

.textarea:focus {
  outline: none;
  border-color: #42b983;
}

.form-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.btn-small {
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
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
</style>
