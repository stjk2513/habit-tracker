import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import IncrementerView from '../views/IncrementerView.vue'
import TodoListView from '../views/TodoListView.vue'
import HabitsView from '../views/HabitsView.vue'
import AddHabitView from '../views/AddHabitView.vue'
import KanbanView from '../views/KanbanView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView
  },
  {
    path: '/incrementer',
    name: 'incrementer',
    component: IncrementerView
  },
  {
    path: '/todos',
    name: 'todos',
    component: TodoListView
  },
  {
    path: '/habits',
    name: 'habits',
    component: HabitsView
  },
  {
    path: '/habits/add',
    name: 'add-habit',
    component: AddHabitView
  },
  {
    path: '/kanban',
    name: 'kanban',
    component: KanbanView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
