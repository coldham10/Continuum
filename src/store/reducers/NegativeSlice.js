import {createSlice} from '@reduxjs/toolkit';
import listReducers from './ListReducers';

export const negativeSlice = createSlice({
  name: 'negative',
  //{type: "negative/add", payload: ...} e.g.
  initialState: [],
  reducers: listReducers(false),
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
} = negativeSlice.actions;

export default negativeSlice.reducer;
