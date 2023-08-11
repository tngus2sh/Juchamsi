import loginform from './loginform';
import formSlice from './formslice';
import addressOpen from './addressOpen';
import mobileauthlogin from './mobileauthlogin';
import mobileMycarstatus from './mobileparking';
import webLoginInfo from './webLoginInfo';
import mobielUserinfo from './mobileUserinfo';
import kioskInfo from './kioskInfo';
import chatInfo from './chatInfo';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';

const persistConfig = {
  key: 'root',
  storage,
}
const rootReducer = combineReducers({
  form: formSlice,
  mycar:mobileMycarstatus,
  loginform: loginform,
  addressOpen: addressOpen,
  auth: mobileauthlogin,
  chatInfo: persistReducer(persistConfig, chatInfo),
  webInfo: persistReducer(persistConfig, webLoginInfo),
  mobileInfo: persistReducer(persistConfig, mobielUserinfo),
  kioskInfo: persistReducer(persistConfig, kioskInfo),
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk]
})

export const persistor = persistStore(store)
