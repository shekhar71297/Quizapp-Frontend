
import { createSlice } from '@reduxjs/toolkit';

const feedbackAnsSlice = createSlice({
  name: 'feedbackAns',
  initialState: {
    allFeedbackAns: [],
    allEmployee: [],
    allBatch: [],
    allBatchWiseStudent: [],
    allCourses: [],
    allScheduledFeedback: [],
    allEmailSendDetails: []

  },
  reducers: {
    getFeedbackAns: (state, action) => {

      state.allFeedbackAns = action.payload;
    },
    getEmployee: (state, action) => {
      state.allEmployee = action.payload;
    },
    getBatch: (state, action) => {

      state.allBatch = action.payload;
    },
    getCourses: (state, action) => {

      state.allCourses = action.payload;
    },
    getScheduledFeedback: (state, action) => {

      state.allScheduledFeedback = action.payload;
    },

    getBatchWiseStudent: (state, action) => {

      state.allBatchWiseStudent = action.payload;
    },
    deleteBatchWiseStudent: (state, action) => {
      state.allBatchWiseStudent = state.allBatchWiseStudent.filter((d) => d.id !== action.payload);
    },

    getFormControlLabelUtilityClasses: (state, action) => {

      state.allCourses = action.payload;
    },

    addScheduledFeedback: (state, action) => {
      state.allScheduledFeedback.push(action.payload);
    },
    addBatchwiseStudent: (state, action) => {
      state.allBatchWiseStudent.push(action.payload);
    },
    updateScheduledFeedback: (state, action) => {
      const index = state.allScheduledFeedback.findIndex((d) => d.id === action.payload.id);
      if (index !== -1) {
        state.allScheduledFeedback[index] = action.payload;
      }
    },
    addEmailDetails: (state, action) => {
      state.allEmailSendDetails.push(action.payload);
    },

  }
})

export const feedbackAnsActions = feedbackAnsSlice.actions;
export default feedbackAnsSlice.reducer;