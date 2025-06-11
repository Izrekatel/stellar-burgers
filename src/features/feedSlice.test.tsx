import { rootReducer } from '../services/store';
import {
  fetchFeedsThunk,
  fetchOrderByNumberThunk,
  feedSlice
} from './feedSlice';
import { user } from './test-data/users';
import { orders } from './test-data/orders';
import * as cookieFunctions from '../utils/cookie';
import * as burgerApiFunctions from '../utils/burger-api';
import {configureStore } from '@reduxjs/toolkit';
import {expect, test, describe} from '@jest/globals';

describe('тест FeedSlice', () => {
    test('fetchFeedsThunk.fulfilled', async () => {
        const mocFeedsResponse = {
            success: true,
            orders: orders, 
            total: 2,
            totalToday: 1
        };

        global.fetch = jest.fn(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mocFeedsResponse),
          })
        ) as jest.Mock;
        
       const testStore = configureStore({
            reducer: rootReducer,
        }); 
        
        await testStore.dispatch(fetchFeedsThunk());
        const state = testStore.getState().feed;
        expect(state.error).toBe(null);
        expect(state.orders).toEqual(orders);
        expect(state.total).toEqual(mocFeedsResponse.total);
        expect(state.totalToday).toEqual(mocFeedsResponse.totalToday);
        expect(state.loading).toBe(false);
    })
    
    test('fetchFeedsThunk.pending устанавливает loading в true', () => {
      const initialState = {
          orders: [],
          total: 0,
          totalToday: 0,
          loading: false,
          error: null,
          currentOrder: null
      };

      const action = { type: fetchFeedsThunk.pending.type };
      const state = feedSlice.reducer(initialState, action);
      expect(state.error).toBe(null);
      expect(state.loading).toBe(true);
    });

    test('fetchFeedsThunk.rejected устанавливает loading в false и пишет ошибку', async () => {
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
       
        await testStore.dispatch(fetchFeedsThunk());
        const state = testStore.getState().feed;
        expect(state.loading).toBe(false);
        expect(state.error).toBeTruthy();
    });

    test('fetchOrderByNumberThunk.fulfilled', async () => {
        const mocOrderByNumberResponse = {
            success: true,
            orders: orders, 
        };
        global.fetch = jest.fn(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mocOrderByNumberResponse),
          })
        ) as jest.Mock;
        
       const testStore = configureStore({
            reducer: rootReducer,
        }); 
        
        await testStore.dispatch(fetchOrderByNumberThunk(1));
        const state = testStore.getState().feed;
        expect(state.error).toBe(null);
        expect(state.currentOrder).toEqual(orders[0]);
        expect(state.loading).toBe(false);
    })
    
    test('fetchOrderByNumberThunk.pending устанавливает loading в true', () => {
      const initialState = {
          orders: [],
          total: 0,
          totalToday: 0,
          loading: false,
          error: null,
          currentOrder: null
      };

      const action = { type: fetchOrderByNumberThunk.pending.type };
      const state = feedSlice.reducer(initialState, action);
      expect(state.error).toBe(null);
      expect(state.loading).toBe(true);
    });

    test('fetchOrderByNumberThunk.rejected устанавливает loading в false и пишет ошибку', async () => {
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
       
        await testStore.dispatch(fetchOrderByNumberThunk(1));
        const state = testStore.getState().feed;
        expect(state.loading).toBe(false);
        expect(state.error).toBeTruthy();
    });
});
