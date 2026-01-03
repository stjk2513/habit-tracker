import type { Module } from "vuex";
import type { RootState } from "../index";

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export interface TodosState {
  todos: Todo[];
  nextId: number;
}

const todosModule: Module<TodosState, RootState> = {
  namespaced: true,

  state: {
    todos: [],
    nextId: 1,
  },

  getters: {
    allTodos: (state) => state.todos,
    completedTodos: (state) => state.todos.filter((todo) => todo.completed),
    activeTodos: (state) => state.todos.filter((todo) => !todo.completed),
    todosCount: (state) => state.todos.length,
    completedCount: (state) =>
      state.todos.filter((todo) => todo.completed).length,
  },

  mutations: {
    ADD_TODO(state, text: string) {
      state.todos.push({
        id: state.nextId++,
        text,
        completed: false,
      });
    },
    TOGGLE_TODO(state, id: number) {
      const todo = state.todos.find((t) => t.id === id);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    REMOVE_TODO(state, id: number) {
      const index = state.todos.findIndex((t) => t.id === id);
      if (index > -1) {
        state.todos.splice(index, 1);
      }
    },
    CLEAR_COMPLETED(state) {
      state.todos = state.todos.filter((todo) => !todo.completed);
    },
  },

  actions: {
    addTodo({ commit }, text: string) {
      if (text.trim()) {
        commit("ADD_TODO", text.trim());
      }
    },
    toggleTodo({ commit }, id: number) {
      commit("TOGGLE_TODO", id);
    },
    removeTodo({ commit }, id: number) {
      commit("REMOVE_TODO", id);
    },
    clearCompleted({ commit }) {
      commit("CLEAR_COMPLETED");
    },
  },
};

export default todosModule;
