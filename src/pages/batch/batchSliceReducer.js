import { createSlice } from '@reduxjs/toolkit';

const batchSlice = createSlice({
  name: 'batch',
  initialState:{
    allBatches: [],
    SingleBatch: {},
    error: null,
    allCourse:[]
  },
  reducers: {
    GET_BATCH: (state, action) => {
      console.log('inside batch reducer:');
      state.allBatches = action.payload;
      state.error = null;
    },

    Get_Course: (state, action) => {
      console.log('inside course reducer:');
      state.allCourse = action.payload;
      state.error = null;
    },
    
    GET_BATCH_ERROR: (state, action) => {
      state.batch = {};
      state.error = action.payload;
    },
    ADD_BATCH: (state, action) => {
      state.allBatches.push(action.payload);
      state.batch = {};
    },
    UPDATE_BATCH: (state, action) => {
      const index = state.allBatches.findIndex(d => d.id === action.payload.id);
      if (index !== -1) {
        state.allBatches[index] = action.payload;
      }
    },
    DELETE_BATCH: (state, action) => {
      state.allBatches = state.allBatches.filter(d => d.id !== action.payload);
    },
    GET_SINGLE_BATCH: (state, action) => {
      const index = state.allBatches.findIndex(d => d.id === action.payload);
      if (index !== -1) {
        state.SingleBatch = state.allBatches[index];
      }
    }
  }
});

export const batchActions = batchSlice.actions;
export default batchSlice.reducer;
