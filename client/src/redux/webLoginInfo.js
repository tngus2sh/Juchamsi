import { createSlice } from '@reduxjs/toolkit';

const webLoginInfo = createSlice({
  name: 'webInfo',
  initialState: {
    id: '',
    name: '',
    roadAddress : '',
    villaName: '',
    parkingLotCol: '',
    identification: '',
    villaIdNumber: '',
    isLogin: false
    
  },
  reducers: {
    setId: (state, action) => {
      state.id = action.payload;
    },
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
    setIsLogin: (state, action) => {
      state.isLogin = action.payload;
    },
    setLogout: (state) => {
      state.id = '';
      state.name = '';
      state.roadAddress = '';
      state.villaName = '';
      state.parkingLotCol = '';
      state.identification = '';
      state.villaIdNumber = '';
      state.isLogin = false;
    },
  },
});

export const { setId, setName, setRoadAddress, setVillaName, setParkingLotCol, setIdentification, setVillaIdNumber, setIsLogin, setLogout } = webLoginInfo.actions;
export default webLoginInfo.reducer;