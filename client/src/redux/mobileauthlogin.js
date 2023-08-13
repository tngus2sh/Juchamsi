import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAutoLoginChecked: false,
    username: '',
    password: '',
    loginchecked:false,
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
    setloginchecked: (state, action) => {
      state.loginchecked = action.payload;
    },

  },
});

export const { setAutoLoginChecked, setUsername, setPassword, setloginchecked } = authSlice.actions;
export default authSlice.reducer;