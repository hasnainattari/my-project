// main store

import { configureStore } from '@reduxjs/toolkit';
import statesReducer from './state';

export const store = configureStore({
    reducer: statesReducer
})