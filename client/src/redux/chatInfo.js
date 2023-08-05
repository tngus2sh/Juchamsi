import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user1: '',
  user2: '',
  roomNumber: ''
};

const chatInfo = createSlice({
  name: 'chatInfo',
  initialState,
  reducers: {
    setUser1: (state, action) => {
      state.user1 = action.payload;
    },
    setUser2: (state, action) => {
      state.user2 = action.payload;
    },
    setRoomNumber: (state, action) => {
      state.roomNumber = action.payload;
    },
   
  },
});
export const { setUser1, setUser2, setRoomNumber} = chatInfo.actions;
export default chatInfo.reducer;