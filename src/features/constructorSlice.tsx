import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TOrder } from '../utils/types';
import { orderBurgerApi } from '../utils/burger-api';

type TConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
  order: TOrder | null;
  orderName: string | null;
  isOrderLoading: boolean;
  error: string | null;
};

const initialState: TConstructorState = {
  bun: null,
  ingredients: [],
  order: null,
  orderName: null,
  isOrderLoading: false,
  error: null
};

export const createOrderThunk = createAsyncThunk(
  'order/create',
  async (ingredients: string[]) => await orderBurgerApi(ingredients)
);

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    setBun(state, action: PayloadAction<TConstructorIngredient>) {
      state.bun = action.payload;
    },
    addIngredient(state, action: PayloadAction<TConstructorIngredient>) {
      state.ingredients.push(action.payload);
    },
    clearConstructor(state) {
      state.bun = null;
      state.ingredients = [];
      state.order = null;
      state.isOrderLoading = false;
      state.orderName = null;
      state.error = null;
    },
    upIngredient: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index <= 0 || index >= state.ingredients.length) return;
      const array = state.ingredients;
      array.splice(index - 1, 0, array.splice(index, 1)[0]);
    },
    downIngredient: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index < 0 || index >= state.ingredients.length - 1) return;
      const array = state.ingredients;
      array.splice(index + 1, 0, array.splice(index, 1)[0]);
    },
    removeIngredient: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload.id
      );
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrderThunk.pending, (state) => {
        state.isOrderLoading = true;
        state.error = null;
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.isOrderLoading = false;
        state.order = action.payload.order;
        state.orderName = action.payload.name;
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.isOrderLoading = false;
        state.error = action.error.message || 'Failed to create order';
      });
  }
});

export const {
  setBun,
  addIngredient,
  clearConstructor,
  upIngredient,
  downIngredient,
  removeIngredient
} = constructorSlice.actions;

export default constructorSlice.reducer;
