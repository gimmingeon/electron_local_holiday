import { createSlice } from "@reduxjs/toolkit";

const calendarSlice = createSlice({
    name: 'calendar',

    initialState: {
        days: [], // { day1: '2025-08-01', member: [{name: '홍길동', type: 'annual'}] } 이런 배열
        history: [],
        future: []
    },

    reducers: {
        setDays: (state, action) => {
            state.days = action.payload.map((item, idx) => ({
                [`day${idx + 1}`]: item.date,
                holidayType: item.holidayType,
                members: item.members.map(m => ({ name: m.name, type: m.type }))
            }));

            state.history = [];
            state.future = [];
        },
        addDay(state, action) {
            const { index, day } = action.payload;
            const key = `day${index}`;
            state.days.push({ [key]: day, holidayType: "nonLegal", members: [], });
        },

        addMember(state, action) {
            const { index, member } = action.payload; // member: {name, type}
            const key = `day${index}`;
            const dayItem = state.days.find(item => item[key]);

            state.history.push(JSON.stringify(state.days));
            state.future = [];

            if (dayItem && !dayItem.members.some(m => m.name === member.name)) {
                dayItem.members.push(member);
            }


        },

        legalWeek(state, action) {
            const { index } = action.payload;
            const key = `day${index + 1}`;
            const dayItem = state.days.find(item => item[key]);
            state.history.push(JSON.stringify(state.days));
            state.future = [];

            dayItem.holidayType = (dayItem.holidayType === "legal") ? "nonLegal" : "legal";

        },

        resetWeek(state, action) {

            const weeks = action.payload

            weeks.map((week, index) => {
                const dayKey = Object.keys(week).find(key => key.startsWith("day"));

                // 현재의 day
                const dayItem = state.days.find(item => item[dayKey]);

                dayItem.members = week.members;
            })
        },

        resetHoliday(state, action) {

            state.history.push(JSON.stringify(state.days));
            state.future = [];

            const dayObj = action.payload;

            const dayKey = Object.keys(dayObj).find(key => key.startsWith("day"));

            // 현재의 day
            const dayItem = state.days.find(item => item[dayKey]);

            if (dayKey) {
                dayItem.members = [];
            }
        },

        addAutoMember(state, action) {
            const { day, member } = action.payload; // member: {name, type}
            const key = day;
            const dayItem = state.days.find(item => item[key]);

            state.history.push(JSON.stringify(state.days));
            state.future = [];

            if (dayItem && !dayItem.members.some(m => m.name === member.name)) {
                dayItem.members.push(member);
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

            state.history.push(JSON.stringify(state.days));
            state.future = [];

            if (dayItem) {
                dayItem.members = dayItem.members.filter(m => m.name !== memberName);
            }
        },

        undoDays(state) {
            if (state.history.length > 1) {
                // 마지막 기록 꺼내서 days 복원
                const prevState = state.history.pop();
                state.future.push(JSON.stringify(state.days));
                state.days = JSON.parse(prevState);
            }
        },

        redoDays(state) {
            if (state.future.length > 0) {
                const nextState = state.future.pop();
                state.history.push(JSON.stringify(state.days)); // undo 스택에 현재 상태 저장
                state.days = JSON.parse(nextState);
            }
        },

        resetData(state) {
            state.history = [];
            state.future = [];
            state.days = [];
        }

    },
});

export const {
    addDay,
    addMember,
    resetDays,
    removeMember,
    addAutoMember,
    setDays,
    resetWeek,
    resetHoliday,
    legalWeek,
    updateDays,
    undoDays,
    redoDays,
    resetData
} = calendarSlice.actions;
export default calendarSlice.reducer;