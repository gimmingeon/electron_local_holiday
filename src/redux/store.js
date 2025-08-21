import { configureStore } from "@reduxjs/toolkit";
import calendarReducer from './calendarSlice.js'
import memberReducer from './memberSlice.js'
import userReducer from './userSlice.js'
import mateReducer from './mateSlice.js'
import conditionReducer from './conditionSlice.js'
import saveReducer from "./saveSlice.js"

const store = configureStore({
    reducer: {
        calendar: calendarReducer,
        member: memberReducer,
        user: userReducer,
        mate: mateReducer,
        condition: conditionReducer,
        save: saveReducer,
    }
});

export default store;