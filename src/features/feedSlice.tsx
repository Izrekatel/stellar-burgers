import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi, getOrderByNumberApi } from '../utils/burger-api';
import { TOrder } from '../utils/types';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
  currentOrder: TOrder | null;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null,
  currentOrder: null
};

export const fetchFeedsThunk = createAsyncThunk(
  'feed/fetchAll',
  async () => await getFeedsApi()
);

export const fetchOrderByNumberThunk = createAsyncThunk(
  'feed/fetchByNumber',
  async (number: number) => await getOrderByNumberApi(number)
);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeedsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeedsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch feeds';
      })
      .addCase(fetchOrderByNumberThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumberThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload.orders[0];
      })
      .addCase(fetchOrderByNumberThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch order';
      });
  }
});

export const { clearCurrentOrder } = feedSlice.actions;

export default feedSlice.reducer;
