// TODO: Set up redux store, using redux-persist to initialize (first open) or rehydrate store.
import {
  configureStore,
  combineReducers,
  createImmutableStateInvariantMiddleware,
} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-community/async-storage';
import positiveReducer from './reducers/PositiveSlice';
import negativeReducer from './reducers/NegativeSlice';
import metaReducer from './reducers/MetaSlice';
import extendHabit from './reducers/ExtendHabit';
import {persistReducer, createTransform} from 'redux-persist';

const reducers = combineReducers({
  positiveList: positiveReducer,
  negativeList: negativeReducer,
  meta: metaReducer,
});

const setTimezoneOnRehydrate = createTransform(
  null,
  (state) => {
    let newState = JSON.parse(JSON.stringify(state));
    newState.forEach(
      (habit) => (habit.timeStamp = new Date(habit.timeStamp).setHours(0)),
    );
    return newState;
  },
  {whitelist: ['positiveList', 'negativeList']},
);

const selectAllOnRehydrate = createTransform(
  null,
  (state) => {
    let newState = JSON.parse(JSON.stringify(state));
    newState.forEach((habit) => (habit.selected = true));
    return newState;
  },
  {whitelist: ['positiveList', 'negativeList']},
);

const extendHistOnRehydrate = createTransform(
  null,
  (state) => {
    let newState = state.map((habit) => extendHabit(habit));
    return newState;
  },
  {whitelist: ['positiveList', 'negativeList']},
);

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  transforms: [
    selectAllOnRehydrate,
    extendHistOnRehydrate,
    setTimezoneOnRehydrate,
  ],
};
const persistedReducer = persistReducer(persistConfig, reducers);

const immutableInvariantMiddleware = createImmutableStateInvariantMiddleware();

export default configureStore({
  reducer: persistedReducer,
  middleware: [immutableInvariantMiddleware],
});
