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
      //Change name or parameters of habit. If necessary, recalculate values
      let index = state.findIndex((habit) => habit.id === action.payload.id);
      if (index !== -1) {
        state[index][action.payload.key] = action.payload.value;
        if (action.payload.key === 'parameters') {
          state[index] = recomputeHistory(state[index], 0, false);
        }
      }
    },
  },
});

export const {add, remove, toggle, edit} = negativeSlice.actions;

export default negativeSlice.reducer;
