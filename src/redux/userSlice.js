import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",

    initialState: {
        id: "",
        email: '',
        name: "",
        phoneNumber: ""
    },

    reducers: {
        setId: (state, action) => {
            state.id = action.payload
        },
        setEmail: (state, action) => {
            state.email = action.payload
        },
        setName: (state, action) => {
            state.name = action.payload;
        },
        setPhoneNumber: (state, action) => {
            state.phoneNumber = action.payload;
        }
    }
});

export const { setId, setEmail, setName, setPhoneNumber } = userSlice.actions;
export default userSlice.reducer