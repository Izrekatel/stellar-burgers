import { configureStore, combineReducers } from '@reduxjs/toolkit';
import user from '../features/userSlice';
import ingredients from '../features/ingredientsSlice';
import feed from '../features/feedSlice';
import burgerConstructor from '../features/constructorSlice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

const rootReducer = combineReducers({
  user,
  ingredients,
  feed,
  burgerConstructor
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
