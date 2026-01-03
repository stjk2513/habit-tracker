<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import type { RootState } from '../store'

const store = useStore<RootState>()

const count = computed(() => store.state.counter.count)
const doubleCount = computed(() => store.getters['counter/doubleCount'])

const increment = () => store.dispatch('counter/increment')
const decrement = () => store.dispatch('counter/decrement')
const reset = () => store.dispatch('counter/reset')
</script>

<template>
  <div class="incrementer">
    <h1>Counter / Incrementer</h1>
    <div class="counter-display">
      <p class="count">{{ count }}</p>
      <p class="double">Double: {{ doubleCount }}</p>
    </div>
    <div class="button-group">
      <button @click="decrement" class="btn btn-decrement">-</button>
      <button @click="reset" class="btn btn-reset">Reset</button>
      <button @click="increment" class="btn btn-increment">+</button>
    </div>
  </div>
</template>

<style scoped>
.incrementer {
  max-width: 500px;
  margin: 0 auto;
  text-align: center;
}

h1 {
  color: #42b983;
  margin-bottom: 2rem;
}

.counter-display {
  background: #f5f5f5;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.count {
  font-size: 4rem;
  font-weight: bold;
  color: #35495e;
  margin: 0;
}

.double {
  font-size: 1.2rem;
  color: #666;
  margin: 0.5rem 0 0 0;
}

.button-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn {
  padding: 0.75rem 2rem;
  font-size: 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
}

.btn:hover {
  transform: scale(1.05);
}

.btn-increment {
  background: #42b983;
  color: white;
}

.btn-increment:hover {
  background: #359268;
}

.btn-decrement {
  background: #e74c3c;
  color: white;
}

.btn-decrement:hover {
  background: #c0392b;
}

.btn-reset {
  background: #95a5a6;
  color: white;
}

.btn-reset:hover {
  background: #7f8c8d;
}
</style>
