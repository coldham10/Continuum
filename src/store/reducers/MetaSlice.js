import {createSlice} from '@reduxjs/toolkit';

export const metaSlice = createSlice({
  name: 'meta',
  //{type: "meta/...", payload: ...} e.g.
  initialState: {premium: false, background: 0},
  reducers: {
    setPremium: () => ({premium: true}),
    setFree: () => ({premium: false}),
    setBackground: (state, action) => {
      if (state.premium) {
        state.background = action.payload;
      }
    },
  },
});

export const {setPremium, setFree} = metaSlice.actions;

export default metaSlice.reducer;
