import { createSlice } from '@reduxjs/toolkit';

const MycarstatusSlice = createSlice({
  name: 'parking status',
  initialState: {
    // 전체 주차 현황
    BoxItem: [],
    // 내차 위치
    mycar: null,
    // 출차 시간(주차한 차량들만 들어가있음)
    Outtime: [],
    // 주차 위치
    parkingnow: [],
    Boxrow:null,
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
    setParkingnow: (state, action) => {
      state.parkingnow = action.payload;
    },
  },
});

export const { setBoxItem, setmycar, setOuttime, setBoxColumn, setBoxrow, setParkingnow} = MycarstatusSlice.actions;
export default MycarstatusSlice.reducer;