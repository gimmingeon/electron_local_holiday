import { createSlice } from "@reduxjs/toolkit";

const calendarSlice = createSlice({
    name: 'calendar',

    initialState: {
        days: []
    },

    reducers: {
        addDay(state, action) {
            const { index, day } = action.payload;
            const key = `day${index}`;
            state.days.push({ [key]: day, member: [] });
        },

        addMember(state, action) {
            const { index, memberName } = action.payload;
            const key = `day${index}`;
            const dayItem = state.days.find(item => item[key]);

            if (dayItem && !dayItem.member.includes(memberName)) {
                dayItem.member.push(memberName);
            }
        },

        addAutoMember(state, action) {
            const { day, memberName } = action.payload;
            const key = day;
            const dayItem = state.days.find(item => item[key]);

            if (dayItem && !dayItem.member.includes(memberName)) {
                dayItem.member.push(memberName);
            }
        },
        resetDays(state) {
            state.days = [];
        },

        //멤버 제거
        removeMember(state, action) {
            const { index, memberName } = action.payload;
            const key = `day${index}`;
            const dayItem = state.days.find(item => item[key]);

            if (dayItem) {
                dayItem.member = dayItem.member.filter(name => name !== memberName);
            }
        }

    },
});

export const { addDay, addMember, resetDays, removeMember, addAutoMember } = calendarSlice.actions;
export default calendarSlice.reducer;