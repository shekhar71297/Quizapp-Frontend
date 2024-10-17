import { createSlice } from '@reduxjs/toolkit';

 const loginSlice = createSlice({
  name: 'login',
  initialState:{
    token:null
  },
  reducers: {
    LOGIN_SUCCESS: (state, action) => {
      state.token = action.payload;
    },
  }
});

export const loginActions = loginSlice.actions;
export default loginSlice.reducer


