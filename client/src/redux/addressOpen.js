import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  open: false,
};

const AddressOpen = createSlice({
  name: 'addressOpen',
  initialState,
  reducers: {
    setOpen: (state) => {
      state.open = true;
    },
    setClose: (state) => {
      state.open = false;
    },
  },
});

export const { setOpen, setClose} = AddressOpen.actions;
export default AddressOpen.reducer;