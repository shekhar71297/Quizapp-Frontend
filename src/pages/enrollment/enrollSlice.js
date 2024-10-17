import { createSlice } from '@reduxjs/toolkit';

const enrollSlice = createSlice({
    name: 'enroll',
    initialState: {
        allEnrollDetails: [],
    },
    reducers: {
        getEnrollmentDetails: (state, action) => {

            state.allEnrollDetails = action.payload;
        },
    }
})

export const enrollActions = enrollSlice.actions;
export default enrollSlice.reducer;