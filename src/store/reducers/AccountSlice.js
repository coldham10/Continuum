import {createSlice} from '@reduxjs/toolkit';

export const accountSlice = createSlice({
  name: 'account',
  //{type: "account/...", payload: ...} e.g.
  initialState: {premium: false},
  reducers: {
    setPremium: () => ({premium: true}),
    setFree: () => ({premium: false}),
  },
});

export const {setPremium, setFree} = accountSlice.actions;

export default accountSlice.reducer;
