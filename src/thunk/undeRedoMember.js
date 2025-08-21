import { undoDays, redoDays } from "../redux/calendarSlice";
import { minusHolidayNameArray, plusHolidayName } from "../redux/memberSlice";
import { setFalse } from "../redux/saveSlice";

// Undo + members 연동
export const undoWithMembers = () => (dispatch, getState) => {
    const state = getState();
    const history = state.calendar.history;
    const currentDays = JSON.parse(JSON.stringify(state.calendar.days)); // undo 전 상태 깊은 복사

    if (history.length > 0) {
        const prevStateStr = history[history.length - 1];
        const prevDays = JSON.parse(prevStateStr); // undo 후 상태

        const addedMembers = [];   // prevDays에 있고 currentDays에 없는 멤버
        const removedMembers = []; // currentDays에 있고 prevDays에 없는 멤버

        currentDays.forEach((day, idx) => {
            const prevDay = prevDays[idx];

            // prevDays에 있고 currentDays에 없는 멤버 = added
            prevDay.members.forEach(m => {
                if (!day.members.some(cm => cm.name === m.name)) addedMembers.push(m.name);
            });

            // currentDays에 있고 prevDays에 없는 멤버 = removed
            day.members.forEach(m => {
                if (!prevDay.members.some(pm => pm.name === m.name)) removedMembers.push(m.name);
            });
        });

        // Undo 실행
        dispatch(undoDays());
        dispatch(setFalse());

        // members 업데이트
        if (addedMembers.length > 0) {
            dispatch(minusHolidayNameArray(addedMembers));
        }

        if (removedMembers.length > 0) {
            dispatch(plusHolidayName(removedMembers));
        }

    }
};
// Redo + members 연동
export const redoWithMembers = () => (dispatch, getState) => {
    const state = getState();
    const future = state.calendar.future;
    const currentDays = state.calendar.days;

    if (future.length > 0) {
        // Redo 후: next 상태
        const nextDays = JSON.parse(future[future.length - 1]);

        const addedMembers = [];   // nextDays에 있고 현재에 없는 멤버
        const removedMembers = []; // 현재에 있고 nextDays에 없는 멤버

        nextDays.forEach((day, idx) => {
            const currentDay = currentDays[idx];

            // nextDays에 있고 currentDays에 없는 멤버 = added
            day.members.forEach(m => {
                if (!currentDay.members.some(cm => cm.name === m.name)) addedMembers.push(m.name);
            });

            // currentDays에 있고 nextDays에 없는 멤버 = removed
            currentDay.members.forEach(m => {
                if (!day.members.some(pm => pm.name === m.name)) removedMembers.push(m.name);
            });
        });

        // 상태 복원
        dispatch(redoDays());
        dispatch(setFalse());

        // 멤버 업데이트
        if (addedMembers.length > 0) {
            dispatch(minusHolidayNameArray(addedMembers));
        }

        if (removedMembers.length > 0) {
            dispatch(plusHolidayName(removedMembers));
        }
    }
};
