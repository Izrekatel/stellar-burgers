import { getIngredientsApi } from '../utils/burger-api';
import { fetchIngredients } from './ingredientsSlice';
import {
  getIngredients,
  getIngredientsLoading,
  getIngredientsError
} from '../services/selectors';
import store from '../services/store';
