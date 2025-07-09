import { createSlice } from "@reduxjs/toolkit";

const conditionSlice = createSlice({
    name: "condition",

    initialState: {
        conditions: [],

    },

    reducers: {
        setCondition: (state, action) => {
            state.conditions = action.payload;
        },

    }

});

export const { setCondition } = conditionSlice.actions;
export default conditionSlice.reducer;