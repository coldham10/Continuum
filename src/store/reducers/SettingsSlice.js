import {createSlice} from '@reduxjs/toolkit';

export const settingsSlice = createSlice({
  name: 'settings',
  //{type: "settings/...", payload: ...} e.g.
  initialState: {premium: false, background: 0, price: '', pending: false},
  reducers: {
    setPremium: (state) =>
      Object.assign({}, state, {premium: true, pending: false}),
    setFree: (state) =>
      Object.assign({}, state, {premium: false, background: 0, pending: false}),
    setBackground: (state, action) => {
      if (state.premium) {
        return Object.assign({}, state, {background: action.payload});
      } else {
        return Object.assign({}, state, {background: 0});
      }
    },
    setPrice: (state, action) =>
      Object.assign({}, state, {price: action.payload}),
    setPending: (state) => Object.assign({}, state, {pending: true}),
    unsetPending: (state) => Object.assign({}, state, {pending: false}),
  },
});

export const {
  setPremium,
  setFree,
  setBackground,
  setPrice,
  setPending,
  unsetPending,
} = settingsSlice.actions;

export default settingsSlice.reducer;
