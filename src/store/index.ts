import { createStore } from "vuex";
import counter, { type CounterState } from "./modules/counter";
import todos, { type TodosState } from "./modules/todos";
import habits, { type HabitsState } from "./modules/habits";
import kanban, { type KanbanState } from "./modules/kanban";

export interface RootState {
  counter: CounterState;
  todos: TodosState;
  habits: HabitsState;
  kanban: KanbanState;
}

const store = createStore<RootState>({
  modules: {
    counter,
    todos,
    habits,
    kanban,
  },
});

export default store;
