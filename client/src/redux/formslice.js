import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    step1Data: {
        name: '',
    phoneNumber: '',
    verificationNumber: '',
    certification: false
    
    },
    step2Data: {
      loginId: '',
      loginPassword: '',
      loginPassword2: '',
      idConfirmation: false,
      passwordMatching: false


  },
    step3Data: {
      roadZipCode : '',
      roadAddress : '',
      regionAddress :'',
      villaName: '',
      parkingLotCol: '',
      privacyAgreement: false
  },
    signOpen: false,
    signMessage:""
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setStep1Data: (state, action) => {
        state.step1Data = { ...state.step1Data, ...action.payload };
      },
    setStep2Data: (state, action) => {
      state.step2Data = { ...state.step2Data, ...action.payload };
    },
    setStep3Data: (state, action) => {
      state.step3Data = { ...state.step3Data, ...action.payload };
    },
    resetForm: (state) => {
      state.step1Data = initialState.step1Data;
      state.step2Data = initialState.step2Data;
      state.step3Data = initialState.step3Data;
    },
    setSignOpen: (state, action) => {
      state.signOpen = action.payload;
    },
    setSignMessage: (state, action) => {
      state.signMessage = action.payload;
    },
  },
});

export const { setStep1Data, setStep2Data, setStep3Data, resetForm, setSignOpen, setSignMessage} = formSlice.actions;
export default formSlice.reducer;