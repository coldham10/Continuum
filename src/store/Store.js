// TODO: Set up redux store, using redux-persist to initialize (first open) or rehydrate store.
import {
  configureStore,
  combineReducers,
  createImmutableStateInvariantMiddleware,
} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-community/async-storage';
import positiveReducer from './reducers/PositiveSlice';
import negativeReducer from './reducers/NegativeSlice';
import {persistReducer} from 'redux-persist';

const reducers = combineReducers({
  positiveList: positiveReducer,
  negativeList: negativeReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const immutableInvariantMiddleware = createImmutableStateInvariantMiddleware();

const persistedReducer = persistReducer(persistConfig, reducers);

export default configureStore({
  reducer: persistedReducer,
  middleware: [immutableInvariantMiddleware],
});
