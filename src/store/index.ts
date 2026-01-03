import { createStore } from "vuex";
import counter, { type CounterState } from "./modules/counter";
import todos, { type TodosState } from "./modules/todos";
import habits, { type HabitsState } from "./modules/habits";

export interface RootState {
  counter: CounterState;
  todos: TodosState;
  habits: HabitsState;
}

const store = createStore<RootState>({
  modules: {
    counter,
    todos,
    habits,
  },
});

export default store;
