import { addMember, removeMember } from "../redux/calendarSlice";
import { minusMonthHoliday, plusMonthHoliday } from "../redux/memberSlice";


export const toggleMemberWithHoliday = ({ index, memberName, memberId }) => (dispatch, getState) => {
    const state = getState();
    const key = `day${index}`
    const dayItem = state.calendar.days.find(item => item[key]);

    if (!dayItem) return;

    const isExist = dayItem.member.includes(memberName);

    if (isExist) {
        // dispatch(removeMember({ index, memberName }));

        // dispatch(plusMonthHoliday(memberId));
        return;
    } else {
        dispatch(addMember({ index, memberName }))

        dispatch(minusMonthHoliday(memberId));
    }
}