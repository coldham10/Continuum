import {createSlice} from '@reduxjs/toolkit';
import listReducers from './ListReducers';

export const positiveSlice = createSlice({
  name: 'positive',
  //{type: "positive/add", payload: ...} e.g.
  initialState: [],
  reducers: listReducers(true),
});

export const {
  add,
  remove,
  toggle,
  edit,
  toggleSelected,
  selectAll,
  deselectAll,
  extendAll,
} = positiveSlice.actions;

export default positiveSlice.reducer;
