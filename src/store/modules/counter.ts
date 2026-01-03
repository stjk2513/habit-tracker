import type { Module } from "vuex";
import type { RootState } from "../index";

export interface CounterState {
  count: number;
}

const counterModule: Module<CounterState, RootState> = {
  namespaced: true,

  state: {
    count: 0,
  },

  getters: {
    doubleCount: (state) => state.count * 2,
  },

  mutations: {
    INCREMENT(state) {
      state.count++;
    },
    DECREMENT(state) {
      state.count--;
    },
    RESET(state) {
      state.count = 0;
    },
    SET_COUNT(state, value: number) {
      state.count = value;
    },
  },

  actions: {
    increment({ commit }) {
      commit("INCREMENT");
    },
    decrement({ commit }) {
      commit("DECREMENT");
    },
    reset({ commit }) {
      commit("RESET");
    },
    setCount({ commit }, value: number) {
      commit("SET_COUNT", value);
    },
  },
};

export default counterModule;
