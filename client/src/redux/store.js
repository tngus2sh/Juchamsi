import { configureStore } from '@reduxjs/toolkit';
import loginform from './loginform';
import formSlice from './formslice';
import addressOpen from './addressOpen';
import mobileauthlogin from './mobileauthlogin'
import mobileMycarstatus from './mobileparking'


const store = configureStore({
  reducer: {
    login: loginform,
    form: formSlice,
    addressOpen: addressOpen,
    auth:mobileauthlogin,
    mycar:mobileMycarstatus,
  },
});

export default store;