import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loginId: '',
  loginPassword: '',
  isStoreLoginChecked: false,
  storedId: '',
};

const loginform = createSlice({
  name: 'loginform',
  initialState,
  reducers: {
    setLoginId: (state, action) => {
      state.loginId = action.payload;
    },
    setLoginPassword: (state, action) => {
      state.loginPassword = action.payload;
    },
    setIsStoreLoginChecked: (state, action) => {
      state.loginPassword = action.payload;
    },
    setStoredId: (state, action) => {
      state.loginPassword = action.payload;
    },
  },
});
export const { setLoginId, setLoginPassword, setIsStoreLoginChecked, setStoredId} = loginform.actions;
export default loginform.reducer;