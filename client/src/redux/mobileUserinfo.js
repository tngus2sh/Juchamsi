import { createSlice } from '@reduxjs/toolkit';

const mobileUserinfo = createSlice({
  name: 'mobileUserinfo',
  initialState: {
    carNumber: '',
    id: null,
    loginId:'',
    name: "",
    phoneNumber: "",
    accessToken:"",
    refreshToken:"",
    villaNumber:"",
    villaIdNumber: "",
    totalMileage:"",
    imageUrl: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png", // 기본 이미지 URL
    
  },
  reducers: {
    setCarNumber: (state, action) => {
      state.carNumber = action.payload;
    },
    setid: (state, action) => {
      state.id = action.payload;
    },
    setloginId: (state, action) => {
      state.loginId = action.payload;
    },
    setname: (state, action) => {
      state.name = action.payload;
    },
    setphoneNumber: (state, action) => {
      state.phoneNumber = action.payload;
    },
    setaccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setrefreshToken: (state, action) => {
      state.refreshToken = action.payload;
    },
    setVillaNumber: (state, action) => {
      state.villaNumber = action.payload
    },
    setvillaIdNumber: (state, action) => {
      state.villaIdNumber = action.payload
    },
    setTotalMileage: (state, action) => {
      state.totalMileage = action.payload
    },
    setImageUrl: (state, action) => {
      state.imageUrl = action.payload;
    },
  },
});

export const { setCarNumber, setid, setloginId, setname, setphoneNumber, setaccessToken, 
               setrefreshToken, setVillaNumber, setvillaIdNumber, setTotalMileage, setImageUrl } = mobileUserinfo.actions;
export default mobileUserinfo.reducer;