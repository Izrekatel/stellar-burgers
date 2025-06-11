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
import { orders } from './test-data/orders';
import * as cookieFunctions from '../utils/cookie';
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
      expect(state.error).toBe(null);
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

    test('registerUserThunk.fulfilled', async () => {
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
        
        await testStore.dispatch(registerUserThunk({name: user.user.name, email: user.user.email, password: 'password'}));
        const state = testStore.getState().user;
        expect(state.error).toBe(null);
        expect(state.user).toEqual(mockUserResponse.user);
        expect(state.isLoading).toBe(false);
    })
    
    test('registerUserThunk.pending устанавливает isOrderLoading в true', () => {
      const initialState = {
          user: null,
          isInit: false,
          isLoading: false,
          orders: [],
          isOrdersLoading: false,
          error: null
      };

      const action = { type: registerUserThunk.pending.type };
      const state = userSlice.reducer(initialState, action);
      expect(state.error).toBe(null);
      expect(state.isLoading).toBe(true);
    });

    test('registerUserThunk.rejected устанавливает isOrderLoading в false и пишет ошибку', async () => {
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
       
        await testStore.dispatch(registerUserThunk({name: user.user.name, email: user.user.email, password: 'password'}));
        const state = testStore.getState().user;
        expect(state.isLoading).toBe(false);
        expect(state.error).toBeTruthy();
    });

    test('logoutUserThunk.fulfilled', async () => {
        const mockUserResponse = {
            success: true,
            refreshToken: user.refreshToken,
            accessToken: user.accessToken,
            user: user.user
        };
        jest.spyOn(burgerApiFunctions, 'saveTokens').mockReturnValue();
        Object.defineProperty(global, 'localStorage', {
          value: {
            getItem: jest.fn(),
            removeItem: jest.fn(),
          },
          writable: true
        });

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
        const stateAfterLogin = testStore.getState().user;
        expect(stateAfterLogin.user).toEqual(mockUserResponse.user);
        
        global.fetch = jest.fn(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(),
          })
        ) as jest.Mock;

        await testStore.dispatch(logoutUserThunk());
        const stateAfterLogout = testStore.getState().user;
        expect(stateAfterLogout.isLoading).toBe(false);
        expect(stateAfterLogout.error).toBe(null);
        expect(stateAfterLogout.user).toBe(null);
    })
    
    test('logoutUserThunk.pending устанавливает isOrderLoading в true', () => {
      const initialState = {
          user: null,
          isInit: false,
          isLoading: false,
          orders: [],
          isOrdersLoading: false,
          error: null
      };
      const action = { type: logoutUserThunk.pending.type };
      const state = userSlice.reducer(initialState, action);
      expect(state.error).toBe(null);
      expect(state.isLoading).toBe(true);
    });

    test('logoutUserThunk.rejected устанавливает isOrderLoading в false и пишет ошибку', async () => {
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
        await testStore.dispatch(logoutUserThunk());
        const state = testStore.getState().user;
        expect(state.isLoading).toBe(false);
        expect(state.error).toBeTruthy();
    });

    test('fetchUserThunk.fulfilled', async () => {
        const mockUserResponse = {
            success: true,
            user: user.user
        };
        jest.spyOn(cookieFunctions, 'getCookie').mockReturnValue("");

        global.fetch = jest.fn(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockUserResponse),
          })
        ) as jest.Mock;
        
       const testStore = configureStore({
            reducer: rootReducer,
        }); 
        
        await testStore.dispatch(fetchUserThunk());
        const state = testStore.getState().user;
        expect(state.user).toEqual(mockUserResponse.user);
        expect(state.isLoading).toBe(false);
        expect(state.error).toBe(null);
    })
    
    test('fetchUserThunk.pending устанавливает isOrderLoading в true', () => {
      const initialState = {
          user: null,
          isInit: false,
          isLoading: false,
          orders: [],
          isOrdersLoading: false,
          error: null
      };
      const action = { type: fetchUserThunk.pending.type };
      const state = userSlice.reducer(initialState, action);
      expect(state.error).toBe(null);
      expect(state.isLoading).toBe(true);
    });

    test('fetchUserThunk.rejected устанавливает isOrderLoading в false и пишет ошибку', async () => {
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
        await testStore.dispatch(fetchUserThunk());
        const state = testStore.getState().user;
        expect(state.isLoading).toBe(false);
        expect(state.error).toBeTruthy();
    });

    test('updateUserThunk.fulfilled', async () => {
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
        const mockUpdatedUserResponse = {
            success: true,
            user: {
              name: "New name",
              email: user.user.email
            }
        };
        global.fetch = jest.fn(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockUpdatedUserResponse),
          })
        ) as jest.Mock;
        
        await testStore.dispatch(updateUserThunk({name: "New name"}));
        const state = testStore.getState().user;
        expect(state.user?.name).toEqual("New name");
        expect(state.isLoading).toBe(false);
        expect(state.error).toBe(null);
    })
    
    test('updateUserThunk.pending устанавливает isOrderLoading в true', () => {
      const initialState = {
          user: null,
          isInit: false,
          isLoading: false,
          orders: [],
          isOrdersLoading: false,
          error: null
      };
      const action = { type: updateUserThunk.pending.type };
      const state = userSlice.reducer(initialState, action);
      expect(state.error).toBe(null);
      expect(state.isLoading).toBe(true);
    });

    test('updateUserThunk.rejected устанавливает isOrderLoading в false и пишет ошибку', async () => {
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
        await testStore.dispatch(updateUserThunk({name: "New name"}));
        const state = testStore.getState().user;
        expect(state.isLoading).toBe(false);
        expect(state.error).toBeTruthy();
    });

    test('forgotPasswordThunk.fulfilled', async () => {
        const mocForgotPasswordResponse = {
            success: true
        };

        global.fetch = jest.fn(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mocForgotPasswordResponse),
          })
        ) as jest.Mock;
        
       const testStore = configureStore({
            reducer: rootReducer,
        }); 
        
        await testStore.dispatch(forgotPasswordThunk(user.user.email));
        const state = testStore.getState().user;
        expect(state.isLoading).toBe(false);
        expect(state.error).toBe(null);
    })
    
    test('forgotPasswordThunk.pending устанавливает isOrderLoading в true', () => {
      const initialState = {
          user: null,
          isInit: false,
          isLoading: false,
          orders: [],
          isOrdersLoading: false,
          error: null
      };
      const action = { type: forgotPasswordThunk.pending.type };
      const state = userSlice.reducer(initialState, action);
      expect(state.error).toBe(null);
      expect(state.isLoading).toBe(true);
    });

    test('forgotPasswordThunk.rejected устанавливает isOrderLoading в false и пишет ошибку', async () => {
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
        await testStore.dispatch(forgotPasswordThunk(user.user.email));
        const state = testStore.getState().user;
        expect(state.isLoading).toBe(false);
        expect(state.error).toBeTruthy();
    });

    test('resetPasswordThunk.fulfilled', async () => {
        const mocResetPasswordResponse = {
            success: true
        };
        jest.spyOn(cookieFunctions, 'getCookie').mockReturnValue('accessToken');

        global.fetch = jest.fn(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mocResetPasswordResponse),
          })
        ) as jest.Mock;
        
       const testStore = configureStore({
            reducer: rootReducer,
        }); 
        
        await testStore.dispatch(resetPasswordThunk('NewPassword'));
        const state = testStore.getState().user;
        expect(state.isLoading).toBe(false);
        expect(state.error).toBe(null);
    })
    
    test('resetPasswordThunk.pending устанавливает isOrderLoading в true', () => {
      const initialState = {
          user: null,
          isInit: false,
          isLoading: false,
          orders: [],
          isOrdersLoading: false,
          error: null
      };
      const action = { type: resetPasswordThunk.pending.type };
      const state = userSlice.reducer(initialState, action);
      expect(state.error).toBe(null);
      expect(state.isLoading).toBe(true);
    });

    test('resetPasswordThunk.rejected устанавливает isOrderLoading в false и пишет ошибку', async () => {
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
        await testStore.dispatch(resetPasswordThunk('NewPassword'));
        const state = testStore.getState().user;
        expect(state.isLoading).toBe(false);
        expect(state.error).toBeTruthy();
    });

    test('getOrdersThunk.fulfilled', async () => {
        const mocGetOrdersdResponse = {
            success: true,
            orders: orders, 
            total: 2,
            totalToday: 1
        };
        jest.spyOn(cookieFunctions, 'getCookie').mockReturnValue('accessToken');

        global.fetch = jest.fn(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mocGetOrdersdResponse),
          })
        ) as jest.Mock;
        
       const testStore = configureStore({
            reducer: rootReducer,
        }); 
        
        await testStore.dispatch(getOrdersThunk());
        const state = testStore.getState().user;
        expect(state.orders).toBe(orders);
        expect(state.isOrdersLoading).toBe(false);
        expect(state.error).toBe(null);
    })
    
    test('getOrdersThunk.pending устанавливает isOrderLoading в true', () => {
      const initialState = {
          user: null,
          isInit: false,
          isLoading: false,
          orders: [],
          isOrdersLoading: false,
          error: null
      };
      const action = { type: getOrdersThunk.pending.type };
      const state = userSlice.reducer(initialState, action);
      expect(state.error).toBe(null);
      expect(state.isOrdersLoading).toBe(true);
    });

    test('getOrdersThunk.rejected устанавливает isOrderLoading в false и пишет ошибку', async () => {
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
        await testStore.dispatch(getOrdersThunk());
        const state = testStore.getState().user;
        expect(state.isOrdersLoading).toBe(false);
        expect(state.error).toBeTruthy();
    });
});
