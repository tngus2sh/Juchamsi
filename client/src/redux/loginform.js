import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: '',
  password: ''
};

const AddressOpen = createSlice({
  name: 'loginform',
  initialState,
  reducers: {
    
  },
});

// export const { setOpen, setClose} = AddressOpen.actions;
export default AddressOpen.reducer;