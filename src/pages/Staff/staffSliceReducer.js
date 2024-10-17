import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    name: 'employee',
    allEmployee: [],
    emp: {},
    error: []
};

export const employeeSlice = createSlice({
    name:'employee',
    initialState,
    reducers: {
        getEmployee: (state, action) => {
            state.allEmployee = action.payload;
        },
        getEmployeeError: (state, action) => {
            state.error = action.payload;
        },
        addEmployee: (state, action) => {
            state.allEmployee.push(action.payload);
        },
        updateEmployee: (state, action) => {
            const index = state.allEmployee.findIndex((d) => d.id === action.payload.id);
            if (index !== -1) {
                state.allEmployee[index] = action.payload;
            }
        },
        deleteEmployee: (state, action) => {
            state.allEmployee = state.allEmployee.filter((d) => d.id !== action.payload);
        },
        singleEmployee: (state, action) => {
            const index = state.allEmployee.findIndex((d) => d.id === action.payload);
            state.emp = state.allEmployee[index];
        }
        
    }
});

export const staffActions = employeeSlice.actions;

export default employeeSlice.reducer;
