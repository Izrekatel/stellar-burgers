import { getConstructorIngredients } from '../services/selectors';
import { rootReducer } from '../services/store';
import {
  addIngredient,
  upIngredient,
  downIngredient,
  removeIngredient,
  createOrderThunk, 
  constructorSlice
} from './constructorSlice';
import { ingredients } from './test-data/ingredients';
import { order } from './test-data/orders';
import * as cookieUtils from '../utils/cookie';
import {configureStore } from '@reduxjs/toolkit';
import {expect, test, describe} from '@jest/globals';

describe('тест constructorSlice', () => {
    test('добавление ингредиента', () => {
        // Начальное состояние
        let state = rootReducer(undefined, { type: '@@INIT' });
        expect(getConstructorIngredients(state)).toEqual([]);
        // Добавляем ингредиент
        state = rootReducer(state, addIngredient(ingredients[0]));
        expect(getConstructorIngredients(state)).toEqual([ingredients[0]]);
    })
    
    test('удаление ингредиента', () => {
        let state = rootReducer(undefined, { type: '@@INIT' });
        state = rootReducer(state, addIngredient(ingredients[0]));
        // Удаляем ингредиент
        state = rootReducer(state, removeIngredient(ingredients[0]));
        expect(getConstructorIngredients(state)).toEqual([]);
    })

    test('изменение порядка ингредиентов', () => {
        let state = rootReducer(undefined, { type: '@@INIT' });
        state = rootReducer(state, addIngredient(ingredients[0]));
        state = rootReducer(state, addIngredient(ingredients[1]));
        // Перемещаем первый ингредиент вверх
        state = rootReducer(state, upIngredient(0));
        expect(getConstructorIngredients(state)).toEqual([ingredients[0], ingredients[1]]);
        // Перемещаем последний ингредиент вниз
        state = rootReducer(state, downIngredient(1));
        expect(getConstructorIngredients(state)).toEqual([ingredients[0], ingredients[1]]);
        // Перемещаем первый ингредиент вниз
        state = rootReducer(state, downIngredient(0));
        expect(getConstructorIngredients(state)).toEqual([ingredients[1], ingredients[0]]);
        // Перемещаем последний ингредиент вверх
        state = rootReducer(state, upIngredient(1));
        expect(getConstructorIngredients(state)).toEqual([ingredients[0], ingredients[1]]);
    })
    test('оформление заказа', async () => {
        const mockOrderResponse = {
            success: true,
            order: order.order,
            name: order.name
        };
        jest.spyOn(cookieUtils, 'getCookie').mockReturnValue('testAccessToken');
        // Мокаем fetch с правильной структурой ответа
        global.fetch = jest.fn(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockOrderResponse),
          })
        ) as jest.Mock;
        
       const testStore = configureStore({
            reducer: rootReducer,
        }); 
        
        await testStore.dispatch(createOrderThunk(['ingredients']));
        const state = testStore.getState().burgerConstructor;
        expect(state.error).toBe(null);
        expect(state.order).toEqual(mockOrderResponse.order);
        expect(state.orderName).toEqual(mockOrderResponse.name);
        expect(state.isOrderLoading).toBe(false);
    })

    test('createOrderThunk.pending устанавливает isOrderLoading в true', () => {
      const initialState = {
        bun: null,
        ingredients: [],
        order: null,
        orderName: null,
        isOrderLoading: false,
        error: null
      };

      const action = { type: createOrderThunk.pending.type };
      const state = constructorSlice.reducer(initialState, action);

      expect(state.isOrderLoading).toBe(true);
    });

    test('createOrderThunk.rejected устанавливает isOrderLoading в false и пишет ошибку', async () => {
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
       
        await testStore.dispatch(createOrderThunk(['ingredients']));
        const state = testStore.getState().burgerConstructor;
        expect(state.isOrderLoading).toBe(false);
        expect(state.error).toBeTruthy();
    });
});
