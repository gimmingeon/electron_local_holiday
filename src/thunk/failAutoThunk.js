import { resetWeek } from "../redux/calendarSlice";
import { plusHolidayName } from "../redux/memberSlice";

export const failAutoReset = (originalWeeks) => (dispatch, getState) => {
    const state = getState();



    const dayKey = originalWeeks.map((week, index) =>
        Object.keys(week).find(k => k.startsWith("day"))
    )

    const days = state.calendar.days;

    const nowDays = dayKey.map(day =>
        days.find(d => d[day] !== undefined)
    );

    const addedMembers = [];

    originalWeeks.forEach((week, index) => {
        const day = nowDays[index];

        day.members.forEach(m => {
            if (!week.members.some(weekMember => weekMember.name === m.name)) addedMembers.push(m.name);
        })
    })

    dispatch(resetWeek(originalWeeks));
    dispatch(plusHolidayName(addedMembers));


}