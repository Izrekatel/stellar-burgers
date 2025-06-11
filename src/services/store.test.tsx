import { rootReducer } from './store';
import userReducer from '../features/userSlice';
import ingredientsReducer from '../features/ingredientsSlice';
import feedReducer from '../features/feedSlice';
import burgerConstructorReducer from '../features/constructorSlice';

import {expect, test, describe} from '@jest/globals';

describe('тест rootReducer', () => {
    test('rootReducer должен корректно инициализироваться', () => {
        const initialState = rootReducer(undefined, { type: '@@INIT' });
        
        expect(initialState).toHaveProperty('user');
        expect(initialState).toHaveProperty('ingredients');
        expect(initialState).toHaveProperty('feed');
        expect(initialState).toHaveProperty('burgerConstructor');

        expect(initialState.user).toEqual(userReducer(undefined, { type: '@@INIT' }));
        expect(initialState.ingredients).toEqual(ingredientsReducer(undefined, { type: '@@INIT' }));
        expect(initialState.feed).toEqual(feedReducer(undefined, { type: '@@INIT' }));
        expect(initialState.burgerConstructor).toEqual(burgerConstructorReducer(undefined, { type: '@@INIT' }));
    })
});
