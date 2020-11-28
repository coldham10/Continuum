import {createSlice} from '@reduxjs/toolkit';
import newHabit from './NewHabit';
import toggleActivity from './ToggleActivity';
import recomputeHistory from './ReHistory';

export const positiveSlice = createSlice({
  name: 'positive',
  //{type: "positive/add", payload: ...} e.g.
  initialState: [],
  reducers: {
    add: (state) => {
      state.push(newHabit(true));
    },
    remove: (state, action) => {
      if (action.payload === -1) {
        return state.slice(0, state.length - 1);
      }
      return state.filter((habit) => habit.id !== action.payload);
    },
    toggle: (state, action) => {
      //Toggle and re-calculate (downstream) history and momentum
      let index = state.findIndex((habit) => habit.id === action.payload.id);
      if (index !== -1) {
        let toggled = toggleActivity(state[index], action.payload.date);
        state[index] = recomputeHistory(toggled.data, toggled.index, true);
      }
    },
    edit: (state, action) => {
      //Change title and parameters of habit. Recalculate values (TODO: if necessary)
      let index;
      if (action.payload.id === -1) {
        index = state.length - 1;
      } else {
        index = state.findIndex((habit) => habit.id === action.payload.id);
      }
      if (index !== -1) {
        state[index].title = action.payload.title;
        state[index].parameters = action.payload.params;
        state[index] = recomputeHistory(state[index], 0, true);
      }
    },
    toggleSelected: (state, action) => {
      //Toggle if a habit is shown in the overview
      let index = state.findIndex((habit) => habit.id === action.payload);
      if (index !== -1) {
        state[index].selected = !state[index].selected;
      }
    },
    selectAll: (state) => {
      state.forEach((habit) => (habit.selected = true));
    },
    deselectAll: (state) => {
      state.forEach((habit) => (habit.selected = false));
    },
  },
});

export const {
  add,
  remove,
  toggle,
  edit,
  toggleSelected,
  selectAll,
  deselcetAll,
} = positiveSlice.actions;

export default positiveSlice.reducer;
