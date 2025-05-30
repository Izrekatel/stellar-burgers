import { RootState } from './store';
import { createSelector } from '@reduxjs/toolkit';

export const getIngredients = (state: RootState) => state.ingredients.items;
export const getIngredientsLoading = (state: RootState) =>
  state.ingredients.loading;
export const getIngredientsError = (state: RootState) =>
  state.ingredients.error;

export const getUser = (state: RootState) => state.user.user;
export const getUserisInit = (state: RootState) => state.user.isInit;
export const getUserLoading = (state: RootState) => state.user.isLoading;
export const getUserOrders = (state: RootState) => state.user.orders;
export const getUserOrdersLoading = (state: RootState) =>
  state.user.isOrdersLoading;

export const getFeedOrders = (state: RootState) => state.feed.orders;
export const getTotal = (state: RootState) => state.feed.total;
export const getTotalToday = (state: RootState) => state.feed.totalToday;
export const getCurrentOrder = (state: RootState) => state.feed.currentOrder;
export const getFeed = createSelector(
  [getTotal, getTotalToday],
  (total, totalToday) => ({ total, totalToday })
);

export const getOrder = (state: RootState) => state.burgerConstructor.order;
export const getOrderName = (state: RootState) =>
  state.burgerConstructor.orderName;
export const getOrderLoading = (state: RootState) =>
  state.burgerConstructor.isOrderLoading;
export const getConstructorBun = (state: RootState) =>
  state.burgerConstructor.bun || null;
export const getConstructorIngredients = (state: RootState) =>
  state.burgerConstructor.ingredients || [];

export const getConstructorItems = createSelector(
  [getConstructorBun, getConstructorIngredients],
  (bun, ingredients) => ({
    bun,
    ingredients: ingredients || []
  })
);
