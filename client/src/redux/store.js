import { configureStore } from '@reduxjs/toolkit';
import formReducer from './formslice';
import addressOpen from './addressOpen';
import mobileauthlogin from './mobileauthlogin'

const store = configureStore({
  reducer: {
    form: formReducer,
    addressOpen: addressOpen,
    auth:mobileauthlogin
  },
});

export default store;