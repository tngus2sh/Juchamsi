import { createSlice } from '@reduxjs/toolkit';
import produce from 'immer';

const initialState = {
  carNumber: "",
  id: null,
  loginId:"",
  name: "",
  phoneNumber: "",
  accessToken:"",
  refreshToken:"",
  villaNumber:"",
  villaIdNumber: "",
  totalMileage:"",
  userMacAdress: "",
  whenEnteringCar: false,
  mileagelist: [],
  fcmToken: "",
  chatingRoomId: "",
  readMessage: "",
  totalMessage:"",
};

const mobileUserinfo = createSlice({
  name: 'mobileUserinfo',
  initialState,
  reducers: {
    initialState,
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
    setUserMacAdress: (state, action) => {
      state.userMacAdress = action.payload;
    },
    setWhenEnteringCar: (state, action) => {
      state.whenEnteringCar = action.payload;
    },
  
    setUserLogout: (state) => {
      return {
        ...initialState,
        carNumber: "",
        id: null,
        loginId: "",
        name: "",
        phoneNumber: "",
        accessToken: "",
        refreshToken: "",
        villaNumber: "",
        villaIdNumber: "",
        totalMileage: "",
        userMacAdress: "",
        whenEnteringCar: false,
        mileagelist: [],
        fcmToken: "",
      };
    },
    setMileageList : (state, action) => {
      state.mileagelist = action.payload
    },
    setFcmToken : (state, action) => {
      state.fcmToken = action.payload
    },
    setChatingRoomId: (state, action) => {
      state.chatingRoomId = action.payload
    },
    setReadMessage: (state, action) => {
      state.readMessage = action.payload
    },
    setTotalMessage: (state, action) => {
      state.totalMessage = action.payload
    },
    

  },
    
  
});

export const { setCarNumber, setid, setloginId, setname, setphoneNumber, setaccessToken, 
               setrefreshToken, setVillaNumber, setvillaIdNumber, setTotalMileage, setImageUrl, 
               setUserMacAdress, setWhenEnteringCar, setUserLogout, setMileageList, setFcmToken, setReadMessage, setChatingRoomId, setTotalMessage} = mobileUserinfo.actions;
export default mobileUserinfo.reducer;