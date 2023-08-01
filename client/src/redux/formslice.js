import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    step1Data: {
        name: '',
        phoneNumber: '',
    },
    step2Data: {
      loginId: '',
      loginPassword: '',
      loginPassword2: ''
  },
    step3Data: {
      roadZipCode : '',
      roadAddress : '',
      regionAddress :'',
      villaName: '',
      parkingLotCol: '',
  },
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
  },
});

export const { setStep1Data, setStep2Data, setStep3Data} = formSlice.actions;
export default formSlice.reducer;