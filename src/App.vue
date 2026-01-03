<script setup lang="ts"></script>

<template>
  <div style="padding: 2rem; font-family: system-ui">
    <nav style="margin-bottom: 2rem">
      <router-link to="/" style="margin-right: 1rem">Home</router-link>
      <router-link to="/about">About</router-link>
    </nav>
    <router-view />
  </div>
</template>

<style scoped>
a {
  color: #42b983;
  text-decoration: none;
  font-weight: 500;
}

a:hover {
  text-decoration: underline;
}

a.router-link-active {
  color: #35495e;
}
</style>
