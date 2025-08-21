import { createSlice } from "@reduxjs/toolkit";

const saveSlice = createSlice({
    name: "save",

    initialState: {
        save: true
    },

    reducers: {
        setTrue: (state) => {
            state.save = true;
        },

        setFalse: (state) => {
            state.save = false;
        }
    }
})

export const {
    setTrue,
    setFalse
} = saveSlice.actions;
export default saveSlice.reducer