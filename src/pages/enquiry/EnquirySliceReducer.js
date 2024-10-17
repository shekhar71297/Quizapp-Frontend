import { createSlice } from '@reduxjs/toolkit';

const enquiryReducer= createSlice({
    name: 'enquiry',
    initialState: {
        allEnquiry: [],
        singleEnquiry:{}
    
    },
    reducers: {
        getEnquiry: (state, action) => {

            state.allEnquiry = action.payload;
        },
        getEnquiryError: (state, action) => {
            state.error = action.payload;
        },
        addEnquiry: (state, action) => {
            state.allEnquiry.push(action.payload);
        },
        updateEnquiry: (state, action) => {
            const index = state.allEnquiry.findIndex((d) => d.id === action.payload.id);
            if (index !== -1) {
                state.allEnquiry[index] = action.payload;
            }
        },
        deleteEnquiry: (state, action) => {
            state.allEnquiry = state.allEnquiry.filter((d) => d.id !== action.payload);
        },
        singleEnquiry: (state, action) => {
            const index = state.allEnquiry.findIndex((d) => d.id === action.payload);
            state.singleEnquiry = state.allEnquiry[index];
        }
        
    }
})

export const enquiryActions = enquiryReducer.actions;
export default enquiryReducer.reducer;