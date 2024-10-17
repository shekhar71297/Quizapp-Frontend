import { createSlice } from '@reduxjs/toolkit';

const examSlice = createSlice({
  name: 'exam',
  initialState:{
    allExam: [],
    SingleExam: {},
    error: null,
    allSubmitExam:[]
  },
  reducers: {
    GET_EXAM: (state, action) => {
      // console.log('inside exam reducer:');
      state.exam = {};
      state.allExam = action.payload;
      state.error = null;
    },
    GET_SUBMIT_EXAM: (state, action) => {
      console.log('inside exam reducer:');
      state.allSubmitExam = action.payload;
      // console.log(action.payload);
      state.error = null;
    },
    GET_EXAM_ERROR: (state, action) => {
      state.exam = {};
      state.error = action.payload;
    },
    ADD_EXAM: (state, action) => {
      state.allExam.push(action.payload);
      state.exam = {};
    },
    UPDATE_EXAM: (state, action) => {
      const index = state.allExam.findIndex(d => d.id === action.payload.id);
      if (index !== -1) {
        state.allExam[index] = action.payload;
      }
    },
    DELETE_EXAM: (state, action) => {
      state.allExam = state.allExam.filter(d => d.id !== action.payload);
    },
    GET_SINGLE_EXAM: (state, action) => {
      const index = state.allExam.findIndex(d => d.id === action.payload);
      if (index !== -1) {
        state.SingleExam = state.allExam[index];
      }
    }
  }
});

export const examActions = examSlice.actions;
export default examSlice.reducer;
