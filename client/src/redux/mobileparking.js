import { createSlice } from '@reduxjs/toolkit';

const MycarstatusSlice = createSlice({
  name: 'parking status',
  initialState: {
    BoxItem: [true, false, true, false, false, true],
    mycar: 2,
    Outtime: ['23.08.01 09:00', '', '23.08.01 06:00', '', '', '23.08.01 05:00'],
    Boxrow:3,
    BoxColumn:2,
  },
  reducers: {
    setBoxItem: (state, action) => {
      state.BoxItem = action.payload;
    },
    setmycar: (state, action) => {
      state.mycar = action.payload;
    },
    setOuttime: (state, action) => {
      state.Outtime = action.payload;
    },
    setBoxrow: (state, action) => {
      state.Boxrow = action.payload;
    },
    setBoxColumn: (state, action) => {
      state.BoxColumn = action.payload;
    },
  },
});

export const { setBoxItem, setmycar, setOuttime, setBoxColumn, setBoxrow} = MycarstatusSlice.actions;
export default MycarstatusSlice.reducer;