import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  allquestions: [],
  questions: {},
  error: null,
  examquestion:[]
};

const questionSlice = createSlice({
  name: 'question',
  initialState,
  reducers: {
    getQuestion:(state, action)=> {
      state.allquestions = action.payload;
    },
    getStartExamQuestion:(state,action)=>{
      state.examquestion = action.payload;
    },
    getQuestionError:(state, action)=> {
      state.error = action.payload;
    },
    addQuestion:(state, action)=> {
      state.allquestions.push(action.payload);
    },
    addImage:(state, action) => {
        state.allquestions.push(action.payload);
      },
    addCsvFile: (state, action) => {
      const csvData = Array.isArray(action.payload) ? action.payload : [];
      // Assuming payload contains an array of objects
        state.allquestions.push(...csvData); // Push CSV data into the allquestions array
      }, 
    updateQuestion:(state, action)=> {
      const updatedQuestion = action.payload;
      state.allquestions = state.allquestions.map(q =>
        q.id === updatedQuestion.id ? updatedQuestion : q
      );
    },
    deleteQuestion:(state, action)=> {
      state.allquestions = state.allquestions.filter(
        q => q.id !== action.payload
      );
    },
  },
});

export const questionActions = questionSlice.actions;

export default questionSlice.reducer;
