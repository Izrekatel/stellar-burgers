import { getIngredients, getIngredientsLoading } from '../services/selectors';
import { rootReducer, store } from '../services/store';
import { ingredientsSlice, fetchIngredients } from './ingredientsSlice';
import { ingredientsWithoutID } from './test-data/ingredients';
import {configureStore } from '@reduxjs/toolkit';

import {expect, test, describe, jest} from '@jest/globals';

describe('тест ingredientsSlice', () => {

    test('загрузка ингредиентов', async () => {

        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
          success: true,
          data: ingredientsWithoutID
        }),
            })
        ) as jest.Mock;
        
       const testStore = configureStore({
            reducer: rootReducer,
        }); 
       
        await testStore.dispatch(fetchIngredients());
        const state = testStore.getState().ingredients;
        expect(state.items).toEqual(ingredientsWithoutID);
        expect(state.loading).toBe(false);
        expect(state.error).toBe(null);
    })
    test('fetchIngredients.pending устанавливает loading в true', () => {
      const initialState = {
        items: [],
        loading: false,
        error: null
      };

      const action = { type: fetchIngredients.pending.type };
      const state = ingredientsSlice.reducer(initialState, action);

      expect(state.loading).toBe(true);
    });

    test('fetchIngredients.rejected устанавливает loading в false и пишет ошибку', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                json: () => Promise.resolve({
          success: true,
          data: ingredientsWithoutID
        }),
            })
        ) as jest.Mock;
        
       const testStore = configureStore({
            reducer: rootReducer,
        }); 
       
        await testStore.dispatch(fetchIngredients());
        const state = testStore.getState().ingredients;
        expect(state.loading).toBe(false);
        expect(state.error).toBeTruthy();
    });

});
