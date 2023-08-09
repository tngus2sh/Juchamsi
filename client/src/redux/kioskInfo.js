import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  kioskVillaId: "",
};

const kioskInfo = createSlice({
  name: 'kioskInfo',
  initialState,
  reducers: {
    setKioskVillaId: (state, action) => {
      state.kioskVillaId = action.payload;
    },
  },
});

export const { setKioskVillaId } = kioskInfo.actions;
export default kioskInfo.reducer;