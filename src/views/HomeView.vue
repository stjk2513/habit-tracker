<script setup lang="ts">
</script>

<template>
  <div class="home-view">
    <h1>Welcome!</h1>
    <p class="subtitle">This is a simple Vue.js application with multiple features.</p>

    <div class="features-section">
      <h2>Available Features</h2>
      <div class="feature-grid">
        <router-link to="/habits" class="feature-card">
          <span class="icon">✅</span>
          <h3>Habit Tracker</h3>
          <p>Track your daily habits and build better routines</p>
        </router-link>

        <router-link to="/kanban" class="feature-card">
          <span class="icon">📋</span>
          <h3>Kanban Board</h3>
          <p>Organize tasks with drag-and-drop columns</p>
        </router-link>

        <router-link to="/todos" class="feature-card">
          <span class="icon">📝</span>
          <h3>Todo List</h3>
          <p>Manage your tasks and stay organized</p>
        </router-link>

        <router-link to="/incrementer" class="feature-card">
          <span class="icon">🔢</span>
          <h3>Incrementer</h3>
          <p>A simple counter demonstration</p>
        </router-link>

        <router-link to="/about" class="feature-card">
          <span class="icon">ℹ️</span>
          <h3>About</h3>
          <p>Learn more about this application</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
}

h1 {
  color: #42b983;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 3rem;
}

h2 {
  color: #35495e;
  margin-bottom: 2rem;
}

.features-section {
  margin-top: 2rem;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.feature-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background: white;
  border: 2px solid #ddd;
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-color: #42b983;
}

.icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  color: #35495e;
  margin: 0.5rem 0;
  font-size: 1.3rem;
}

.feature-card p {
  color: #666;
  margin: 0.5rem 0 0 0;
  font-size: 0.95rem;
  line-height: 1.5;
}
</style>
