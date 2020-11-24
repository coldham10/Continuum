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
      //Change name or parameters of habit. If necessary, recalculate values
      let index = state.findIndex((habit) => habit.id === action.payload.id);
      if (index !== -1) {
        state[index][action.payload.key] = action.payload.value;
        if (action.payload.key === 'parameters') {
          state[index] = recomputeHistory(state[index], 0, true);
        }
      }
    },
  },
});

export const {add, remove, toggle, edit} = positiveSlice.actions;

export default positiveSlice.reducer;
