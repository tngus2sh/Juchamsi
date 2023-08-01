
import loginform from './loginform';
import formSlice from './formslice';
import addressOpen from './addressOpen';
import mobileauthlogin from './mobileauthlogin'
<<<<<<< HEAD
import mobileMycarstatus from './mobileparking'
=======
import webLoginInfo from './webLoginInfo';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';
>>>>>>> 900a47ebafb3058221e19406e7115d342661060e

const persistConfig = {
  key: 'root',
  storage,
}

<<<<<<< HEAD
const store = configureStore({
  reducer: {
    login: loginform,
    form: formSlice,
    addressOpen: addressOpen,
    auth:mobileauthlogin,
    mycar:mobileMycarstatus,
  },
=======
const rootReducer = combineReducers({
  form: formSlice,
  loginform: loginform,
  addressOpen: addressOpen,
  auth: mobileauthlogin,
  webInfo: persistReducer(persistConfig, webLoginInfo),
>>>>>>> 900a47ebafb3058221e19406e7115d342661060e
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk]
})

export const persistor = persistStore(store)
