
import { configureStore } from '@reduxjs/toolkit';
import voucherSlice from '../pages/voucher/voucherSliceReducer';
import examSlice from '../pages/exam/examSliceReducer';
import loginSlice from '../pages/login/loginSliceReducer';
import userSlice from '../pages/user/userSliceReducer';
import employeeSlice from '../pages/Staff/staffSliceReducer';
import feedbackSlice from '../pages/feedback/feedbackSliceReducer';
import questionSlice from '../pages/question/questionSliceReducer';
import resultSliceReducer from '../pages/result/resultSliceReducer';
import feedbackAnsSlice from '../pages/trainerFeedback/trainerSliceReducer'
import batchSlice from '../pages/batch/batchSliceReducer'
import enquiryReducer from '../pages/enquiry/EnquirySliceReducer'
import enrollSlice from '../pages/enrollment/enrollSlice';
export default function createStore(preloadedState = {}) {
  const store = configureStore(
    {
      reducer: {
        voucher: voucherSlice,
        exam: examSlice,
        login: loginSlice,
        user: userSlice,
        employee: employeeSlice,
        feedback: feedbackSlice,
        question: questionSlice,
        result: resultSliceReducer,
        feedbackAns:feedbackAnsSlice,
        batch:batchSlice,
        enquiry:enquiryReducer,
        enroll:enrollSlice,
        
      },
      preloadedState,
    }
  );

  return store;
};


