import { createSlice } from "@reduxjs/toolkit";

const calendarSlice = createSlice({
    name: 'calendar',

    initialState: {
        days: []
    },

    reducers: {
        setDays: (state, action) => {
            state.days = action.payload.map((item, idx) => ({
                [`day${idx + 1}`]: item.date,
                member: item.members.map(m => m.name)
            }));
        },
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

        resetWeek(state, action) {

            const weeks = action.payload

            weeks.map((week, index) => {
                const dayKey = Object.keys(week).find(key => key.startsWith("day"));

                // 현재의 day
                const dayItem = state.days.find(item => item[dayKey]);

                dayItem.member = week.member;
            })
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
        },

        // resetWeek(state, action) {
        //     const {index, }
        // }

    },
});

export const { addDay, addMember, resetDays, removeMember, addAutoMember, setDays, resetWeek } = calendarSlice.actions;
export default calendarSlice.reducer;