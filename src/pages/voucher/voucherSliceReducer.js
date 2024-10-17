import {createSlice } from '@reduxjs/toolkit';



 const voucherSlice = createSlice({
  name: 'voucher',
  initialState: {
    allvouchers: [],
    voucher: {},
  },
  reducers: {
    GET_VOUCHER: (state, action) => {
      
      state.allvouchers = action.payload; // Update allvouchers with the payload
    },
    ADD_VOUCHER: (state, action) => {
      state.allvouchers.push(action.payload); // Add the new voucher to allvouchers array
    },
    UPDATE_VOUCHER: (state, action) => {
      const vcodes = action.payload;
      const index = state.allvouchers.findIndex(voucher => voucher.id === vcodes.id);
      if (index !== -1) {
        // Replace the existing voucher with the updated one
        state.allvouchers.splice(index, 1, vcodes);
      }
    },
    DELETE_VOUCHER: (state, action) => {
      if (state.allvouchers.length > 0) { // Check if allvouchers has items
        state.allvouchers = state.allvouchers.filter(voucher => voucher.id !== action.payload.id);
      }
  }
}
})

export const voucherActions = voucherSlice.actions;
export default voucherSlice.reducer;