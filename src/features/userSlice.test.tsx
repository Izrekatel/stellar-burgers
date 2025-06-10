import { getConstructorIngredients } from '../services/selectors';
import { rootReducer } from '../services/store';
import {
  loginUserThunk,
  registerUserThunk,
  logoutUserThunk,
  fetchUserThunk,
  updateUserThunk,
  forgotPasswordThunk,
  resetPasswordThunk,
  getOrdersThunk,
  userSlice
} from './userSlice';
import { user } from './test-data/users';
import * as burgerApiFunctions from '../utils/burger-api';
import {configureStore } from '@reduxjs/toolkit';
import {expect, test, describe} from '@jest/globals';

describe('тест UserSlice', () => {
    test('loginUserThunk.fulfilled', async () => {
        const mockUserResponse = {
            success: true,
            refreshToken: user.refreshToken,
            accessToken: user.accessToken,
            user: user.user
        };
        jest.spyOn(burgerApiFunctions, 'saveTokens').mockReturnValue();

        global.fetch = jest.fn(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockUserResponse),
          })
        ) as jest.Mock;
        
       const testStore = configureStore({
            reducer: rootReducer,
        }); 
        
        await testStore.dispatch(loginUserThunk({email: user.user.email, password: 'password'}));
        const state = testStore.getState().user;
        expect(state.error).toBe(null);
        expect(state.user).toEqual(mockUserResponse.user);
        expect(state.isLoading).toBe(false);
    })
    
    test('loginUserThunk.pending устанавливает isOrderLoading в true', () => {
      const initialState = {
          user: null,
          isInit: false,
          isLoading: false,
          orders: [],
          isOrdersLoading: false,
          error: null
      };

      const action = { type: loginUserThunk.pending.type };
      const state = userSlice.reducer(initialState, action);

      expect(state.isLoading).toBe(true);
    });



    test('loginUserThunk.rejected устанавливает isOrderLoading в false и пишет ошибку', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                json: () => Promise.resolve({
          success: false,
          message: 'Error'
        }),
            })
        ) as jest.Mock;
        
       const testStore = configureStore({
            reducer: rootReducer,
        }); 
       
        await testStore.dispatch(loginUserThunk({email: user.user.email, password: 'password'}));
        const state = testStore.getState().user;
        expect(state.isLoading).toBe(false);
        expect(state.error).toBeTruthy();
    });
});
