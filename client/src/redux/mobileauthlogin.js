import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAutoLoginChecked: false,
    username: '',
    password: '',
  },
  reducers: {
    setAutoLoginChecked: (state, action) => {
      state.isAutoLoginChecked = action.payload;
    },
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },

  },
});

export const { setAutoLoginChecked, setUsername, setPassword } = authSlice.actions;
export default authSlice.reducer;