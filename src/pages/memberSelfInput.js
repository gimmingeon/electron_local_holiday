import { useDispatch } from "react-redux";
import { addMember, legalWeek, removeMember } from "../redux/calendarSlice.js";
import "../css/memberSelfInput.css"
import { minusMonthHoliday, plusMonthHoliday } from "../redux/memberSlice.js";
import { setFalse } from "../redux/saveSlice.js";

export default function MemberSelfInput({ selectedDayInfo, members, setSelectedDayInfo }) {

    const dispatch = useDispatch();

    // 멤버 넣기
    const handleInputMember = (memberName, dateIndex, memberId, annual) => {

        dispatch(setFalse());
        //중복방지 및 배정된 인원에 바로 추가
        if (!selectedDayInfo.members.some(m => m.name === memberName)) {

            const newMember = { name: memberName, type: annual };

            dispatch(addMember({
                index: dateIndex + 1,
                member: newMember
            }));

            setSelectedDayInfo(prev => ({
                ...prev,
                members: [...prev.members, newMember],
            }));

            dispatch(minusMonthHoliday(memberId));

            // 멤버 내부에 있으면 제거후 수정
        } else {
            dispatch(removeMember({ index: dateIndex + 1, memberName }));

            setSelectedDayInfo(prev => ({
                ...prev,
                members: prev.members.filter(m => m.name !== memberName),
            }))

            dispatch(plusMonthHoliday(memberId));
        }

    }

    const handleLegalWeek = (index) => {
        dispatch(legalWeek({ index }))
    }

    return (
        <div>
            <h2>{selectedDayInfo.date}</h2>
            <div>
                <h2>멤버 목록</h2>

                <div
                    onClick={() => handleLegalWeek(selectedDayInfo.index)}
                    className="selfInput-redDay"
                >빨간날</div>

                {members.length === 0 ? (
                    <p>멤버가 없습니다.</p>
                ) : (
                    <ul className="selfInput-member-list">
                        {members.map((member) => {
                            const membersInDay = selectedDayInfo.members || [];
                            const isSelected = membersInDay.some(m => m.name === member.name);
                            return (
                                <div key={member.id}> {/* key는 최상위 요소에 */}
                                    <div
                                        onClick={() => handleInputMember(member.name, selectedDayInfo.index, member.id, "nonAnnual")}
                                        className={`selfInput-sidebar-member ${isSelected ? "selfInput-selected-member" : ""}`}
                                    >
                                        <div>이름 : {member.name} {isSelected && "✅"}</div>
                                        <div>직책 : {member.role}</div>
                                    </div>
                                    <div
                                        onClick={() =>
                                            handleInputMember(member.name, selectedDayInfo.index, member.id, "Annual")}
                                        className="selfInput-annual-holiday"
                                    >
                                        연차 넣기
                                    </div>
                                </div>
                            );
                        })}
                    </ul>

                )}
            </div>
        </div>
    )
}