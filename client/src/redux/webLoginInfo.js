import { createSlice } from '@reduxjs/toolkit';

const webLoginInfo = createSlice({
  name: 'webInfo',
  initialState: {
    name: '',
    roadAddress : '',
    villaName: '',
    parkingLotCol: '',
    identification: '',
    villaIdNumber:''
    
  },
  reducers: {
    setName: (state, action) => {
      state.name = action.payload;
    },
    setRoadAddress: (state, action) => {
      state.roadAddress = action.payload;
    },
    setVillaName: (state, action) => {
      state.villaName = action.payload;
    },
    setParkingLotCol: (state, action) => {
      state.parkingLotCol = action.payload;
    },
    setIdentification: (state, action) => {
      state.identification = action.payload;
    },
    setVillaIdNumber: (state, action) => {
      state.villaIdNumber = action.payload;
    },
  },
});

export const { setName, setRoadAddress, setVillaName, setParkingLotCol, setIdentification, setVillaIdNumber } = webLoginInfo.actions;
export default webLoginInfo.reducer;