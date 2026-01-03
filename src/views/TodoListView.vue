<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import type { RootState } from '../store'
import type { Todo } from '../store/modules/todos'

const store = useStore<RootState>()

const newTodoText = ref('')

const allTodos = computed<Todo[]>(() => store.getters['todos/allTodos'])
const activeTodos = computed<Todo[]>(() => store.getters['todos/activeTodos'])
const completedTodos = computed<Todo[]>(() => store.getters['todos/completedTodos'])
const todosCount = computed(() => store.getters['todos/todosCount'])
const completedCount = computed(() => store.getters['todos/completedCount'])

const addTodo = () => {
  if (newTodoText.value.trim()) {
    store.dispatch('todos/addTodo', newTodoText.value)
    newTodoText.value = ''
  }
}

const toggleTodo = (id: number) => {
  store.dispatch('todos/toggleTodo', id)
}

const removeTodo = (id: number) => {
  store.dispatch('todos/removeTodo', id)
}

const clearCompleted = () => {
  store.dispatch('todos/clearCompleted')
}
</script>

<template>
  <div class="todo-list">
    <h1>Todo List</h1>

    <div class="stats">
      <span>Total: {{ todosCount }}</span>
      <span>Active: {{ activeTodos.length }}</span>
      <span>Completed: {{ completedCount }}</span>
    </div>

    <form @submit.prevent="addTodo" class="add-todo">
      <input
        v-model="newTodoText"
        type="text"
        placeholder="What needs to be done?"
        class="todo-input"
      />
      <button type="submit" class="btn btn-add">Add</button>
    </form>

    <div v-if="allTodos.length === 0" class="empty-state">
      <p>No todos yet. Add one above!</p>
    </div>

    <ul v-else class="todos">
      <li
        v-for="todo in allTodos"
        :key="todo.id"
        :class="{ completed: todo.completed }"
        class="todo-item"
      >
        <input
          type="checkbox"
          :checked="todo.completed"
          @change="toggleTodo(todo.id)"
          class="todo-checkbox"
        />
        <span class="todo-text">{{ todo.text }}</span>
        <button @click="removeTodo(todo.id)" class="btn-delete">×</button>
      </li>
    </ul>

    <div v-if="completedTodos.length > 0" class="actions">
      <button @click="clearCompleted" class="btn btn-clear">
        Clear Completed ({{ completedCount }})
      </button>
    </div>
  </div>
</template>

<style scoped>
.todo-list {
  max-width: 600px;
  margin: 0 auto;
}

h1 {
  color: #42b983;
  margin-bottom: 1.5rem;
  text-align: center;
}

.stats {
  display: flex;
  justify-content: space-around;
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  color: #666;
}

.add-todo {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.todo-input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.todo-input:focus {
  outline: none;
  border-color: #42b983;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-add {
  background: #42b983;
  color: white;
}

.btn-add:hover {
  background: #359268;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #999;
}

.todos {
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem 0;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  transition: all 0.2s;
}

.todo-item:hover {
  border-color: #42b983;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.todo-item.completed {
  opacity: 0.6;
  background: #f9f9f9;
}

.todo-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.todo-text {
  flex: 1;
  font-size: 1rem;
}

.todo-item.completed .todo-text {
  text-decoration: line-through;
  color: #999;
}

.btn-delete {
  width: 30px;
  height: 30px;
  border: none;
  background: #e74c3c;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.5rem;
  line-height: 1;
  transition: all 0.2s;
  padding: 0;
}

.btn-delete:hover {
  background: #c0392b;
  transform: scale(1.1);
}

.actions {
  text-align: center;
}

.btn-clear {
  background: #95a5a6;
  color: white;
}

.btn-clear:hover {
  background: #7f8c8d;
}
</style>
