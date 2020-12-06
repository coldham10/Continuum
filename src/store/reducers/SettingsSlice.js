import {createSlice} from '@reduxjs/toolkit';

export const settingsSlice = createSlice({
  name: 'settings',
  //{type: "settings/...", payload: ...} e.g.
  initialState: {premium: false, background: 0},
  reducers: {
    setPremium: (state) => ({premium: true, background: state.background}),
    setFree: () => ({premium: false, background: 0}),
    setBackground: (state, action) => {
      if (state.premium) {
        return {premium: state.premium, background: action.payload};
      } else {
        return {premium: state.premium, background: 0};
      }
    },
  },
});

export const {setPremium, setFree, setBackground} = settingsSlice.actions;

export default settingsSlice.reducer;
