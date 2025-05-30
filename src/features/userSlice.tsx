import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  loginUserApi,
  registerUserApi,
  logoutApi,
  getUserApi,
  updateUserApi,
  forgotPasswordApi,
  resetPasswordApi,
  TRegisterData,
  TLoginData,
  getOrdersApi
} from '../utils/burger-api';

import { TUser, TOrder } from '../utils/types';

type TUserState = {
  user: TUser | null;
  isInit: boolean;
  isLoading: boolean;
  orders: TOrder[];
  isOrdersLoading: boolean;
  error: string | null;
};

const initialState: TUserState = {
  user: null,
  isInit: false,
  isLoading: false,
  orders: [],
  isOrdersLoading: false,
  error: null
};

export const loginUserThunk = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => await loginUserApi(data)
);

export const registerUserThunk = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => await registerUserApi(data)
);

export const logoutUserThunk = createAsyncThunk(
  'user/logout',
  async () => await logoutApi()
);

export const fetchUserThunk = createAsyncThunk(
  'user/fetch',
  async () => await getUserApi()
);

export const updateUserThunk = createAsyncThunk(
  'user/update',
  async (data: Partial<TRegisterData>) => await updateUserApi(data)
);

export const forgotPasswordThunk = createAsyncThunk(
  'user/forgotPassword',
  async (email: string) => await forgotPasswordApi({ email })
);

export const resetPasswordThunk = createAsyncThunk(
  'user/resetPassword',
  async (password: string) => await resetPasswordApi({ password })
);

export const getOrdersThunk = createAsyncThunk(
  'user/getUserOrders',
  async () => await getOrdersApi()
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    initUser: (state) => {
      state.isInit = true;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Логин
      .addCase(loginUserThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isInit = true;
      })

      // Регистрация
      .addCase(registerUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Registration failed';
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isInit = true;
      })

      // Выход
      .addCase(logoutUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Logout failed';
      })
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
      })

      // Получение пользователя
      .addCase(fetchUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch user';
      })
      .addCase(fetchUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isInit = true;
      })

      // Обновление пользователя
      .addCase(updateUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update user';
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })

      // Восстановление пароля
      .addCase(forgotPasswordThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPasswordThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to reset password';
      })
      .addCase(forgotPasswordThunk.fulfilled, (state) => {
        state.isLoading = false;
      })

      // Сброс пароля
      .addCase(resetPasswordThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPasswordThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to reset password';
      })
      .addCase(resetPasswordThunk.fulfilled, (state) => {
        state.isLoading = false;
      })
      // Получение заказов пользователя
      .addCase(getOrdersThunk.pending, (state) => {
        state.isOrdersLoading = true;
      })
      .addCase(getOrdersThunk.rejected, (state, action) => {
        state.isOrdersLoading = false;
        state.error = action.error.message || 'Failed to get user orders';
      })
      .addCase(getOrdersThunk.fulfilled, (state, action) => {
        state.isOrdersLoading = false;
        state.orders = action.payload;
      });
  }
});

export const { clearError, initUser } = userSlice.actions;

export default userSlice.reducer;
