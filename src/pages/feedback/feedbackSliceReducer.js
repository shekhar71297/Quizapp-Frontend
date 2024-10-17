import { createSlice } from '@reduxjs/toolkit';

const feedbackSlice = createSlice({
    name: 'feedback',
    initialState: {
        allFeedback: [],
        allBranch:[]
    },
    reducers: {
        getFeedback: (state, action) => {

            state.allFeedback = action.payload;
        },
        getBranch: (state, action) => {

            state.allBranch = action.payload;
        },
        postFeedback: (state, action) => {
            state.allFeedback.push(action.payload); 
          },
    }
})

export const feedbackActions = feedbackSlice.actions;
export default feedbackSlice.reducer;