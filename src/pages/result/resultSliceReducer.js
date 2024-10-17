import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  allresult: [],
  result: {},
  error: null,
  allBatch: [],
  allBatchWiseStudent: [],
};

const resultSlice = createSlice({
  name: 'result',
  initialState,
  reducers: {
    getResult(state, action) {
      state.allresult = action.payload;
    },
    getResultError(state, action) {
      state.error = action.payload;
    },
    addResult(state, action) {
      state.allresult.push(action.payload);
      console.log(state.allresult);
    },
    getBatchWiseStudent: (state, action) => {

      state.allBatchWiseStudent = action.payload;
    },
    getBatch: (state, action) => {

      state.allBatch = action.payload;
    },
    
    
  },
});

export const resultActions = resultSlice.actions;

export default resultSlice.reducer;
