import { createSlice } from "@reduxjs/toolkit";

const mateSlice = createSlice({
    name: "mate",

    initialState: {
        mates: [],
        form: {
            member1Name: "",
            member2Name: "",
        }
    },

    reducers: {
        setMate: (state, action) => {
            state.mates = action.payload;
        },

        updateMateForm(state, action) {
            const { field, value } = action.payload;
            state.form[field] = value;
        },

        addMate: (state, action) => {
            state.mates.push(action.payload);
        },

        resetMateForm(state) {
            state.form = { id: '', role: '', member1Name: '', member2Name: '' }
        }
    }
});

export const { setMate, updateMateForm, addMate, resetMateForm } = mateSlice.actions;
export default mateSlice.reducer