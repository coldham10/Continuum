// TODO: Set up redux store, using redux-persist to initialize (first open) or rehydrate store.
import {configureStore} from '@reduxjs/toolkit';
import positiveReducer from './reducers/PositiveSlice';
import negativeReducer from './reducers/NegativeSlice';

export default configureStore({
  reducer: {
    positiveList: positiveReducer,
    negativeList: negativeReducer,
  },
});
