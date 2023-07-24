import { configureStore } from '@reduxjs/toolkit';
import formReducer from './formslice';
import addressOpen from './addressOpen';

const store = configureStore({
  reducer: {
    form: formReducer,
    addressOpen: addressOpen
  },
});

export default store;