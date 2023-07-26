import { configureStore } from '@reduxjs/toolkit';
import loginform from './loginform';
import formSlice from './formslice';
import addressOpen from './addressOpen';


const store = configureStore({
  reducer: {
    login: loginform,
    form: formSlice,
    addressOpen: addressOpen
  },
});

export default store;