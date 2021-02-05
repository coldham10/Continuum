import {createSlice} from '@reduxjs/toolkit';

export const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    premium: false,
    background: 0,
    price: '',
    pending: false,
    reminder: true,
    reminderHour: 10,
    reminderMinute: 0,
  },
  reducers: {
    setPremium: (state) =>
      Object.assign({}, state, {premium: true, pending: false}),
    dangerouslySetFree: (state) =>
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
    setReminder: (state) => Object.assign({}, state, {reminder: true}),
    unsetReminder: (state) => Object.assign({}, state, {reminder: false}),
    setReminderTime: (state, action) => {
      let hr = action.payload.hour;
      if (typeof hr !== 'number' || hr < 0 || hr > 23) {
        hr = state.reminderHour;
      }
      let min = action.payload.minute;
      if (typeof min !== 'number' || min < 0 || min > 59) {
        min = state.reminderMinute;
      }
      return Object.assign({}, state, {
        reminderHour: hr,
        reminderMinute: min,
      });
    },
  },
});

export const {
  setPremium,
  dangerouslySetFree,
  setBackground,
  setPrice,
  setPending,
  unsetPending,
  setReminder,
  unsetReminder,
  setReminderTime,
} = settingsSlice.actions;

export default settingsSlice.reducer;
