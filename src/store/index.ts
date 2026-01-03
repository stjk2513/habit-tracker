import { createStore } from "vuex";
import counter, { type CounterState } from "./modules/counter";
import todos, { type TodosState } from "./modules/todos";

export interface RootState {
  counter: CounterState;
  todos: TodosState;
}

const store = createStore<RootState>({
  modules: {
    counter,
    todos,
  },
});

export default store;
