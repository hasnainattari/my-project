import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    isLogin: null,
}

export const stateSlice = createSlice({
    name: 'globalStates',
    initialState,
    reducers: {
        login: (state: any, action) => {
            state.user = action.payload
            state.isLogin = true
        },
        logout: (state: any) => {
            state.user = null
            state.isLogin = false
        },
    }
})

export const { login, logout } = stateSlice.actions

export default stateSlice.reducer