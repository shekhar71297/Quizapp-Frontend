import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    allUser: [],
    SingleUser: {},
    error: null,
    allBranch: [],
    loginUser: []
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        getBranch: (state, action) => {
            state.allBranch = action.payload;
        },

        getUser: (state, action) => {
            state.SingleUser = {};
            state.allUser = action.payload;
        },
        getUserError: (state, action) => {
            state.SingleUser = {};
            state.error = action.payload;
        },
        addUser: (state, action) => {
            state.allUser.push(action.payload);
            state.SingleUser = {};
        },
        updateUser: (state, action) => {
            const index = state.allUser.findIndex((d) => d.id === action.payload.id);
            if (index !== -1) {
                state.allUser[index] = action.payload;
            }
        },
        deleteUser: (state, action) => {
            state.allUser = state.allUser.filter((d) => d.id !== action.payload);
        },
        GetSingleUser: (state, action) => {
            const index = state.allUser.findIndex(d => d.id === action.payload);
            const user = state.allUser[index];
            state.SingleUser = user;
        },
        GetLogginUser: (state, action) => {
            state.loginUser = action.payload;
        }
    }

});

export const userActions = userSlice.actions;
export default userSlice.reducer;
