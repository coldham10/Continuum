import {createSlice} from '@reduxjs/toolkit';
import toggleActivity from './ToggleActivity';
import newHabit from './NewHabit';
import recomputeHistory from './ReHistory';

export const negativeSlice = createSlice({
  name: 'negative',
  //{type: "negative/add", payload: ...} e.g.
  initialState: [],
  reducers: {
    add: (state) => {
      state.push(newHabit(false));
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
        state[index] = recomputeHistory(toggled.data, toggled.index, false);
      }
    },
    edit: (state, action) => {
      console.log(action);
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
        state[index] = recomputeHistory(state[index], 0, false);
      }
    },
  },
});

export const {add, remove, toggle, edit} = negativeSlice.actions;

export default negativeSlice.reducer;
