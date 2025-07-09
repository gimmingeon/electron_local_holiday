import { useDispatch } from "react-redux";
import { addMember, removeMember } from "../redux/calendarSlice.js";

export default function MemberSelfInput({ selectedDayInfo, members, setSelectedDayInfo }) {

    const dispatch = useDispatch();

    // 멤버 넣기
    const handleInputMember = (memberName, dateIndex) => {
        //중복방지 및 배정된 인원에 바로 추가
        if (!selectedDayInfo.members.includes(memberName)) {
            dispatch(addMember({ index: dateIndex + 1, memberName }));
            setSelectedDayInfo(prev => ({
                ...prev,
                members: [...prev.members, memberName],
            }));

            // 멤버 내부에 있으면 제거후 수정
        } else {
            dispatch(removeMember({ index: dateIndex + 1, memberName }));

            setSelectedDayInfo(prev => ({
                ...prev,
                members: prev.members.filter(name => name !== memberName),
            }))
        }

    }

    return (
        <div>
            <h2>{selectedDayInfo.date}</h2>
            <p>배정된 멤버: {selectedDayInfo.members.length > 0 ? selectedDayInfo.members.join(", ") : "없음"}</p>

            <div>
                <h2>멤버 목록</h2>

                {members.length === 0 ? (
                    <p>멤버가 없습니다.</p>
                ) : (
                    <ul>
                        {members.map((member) => {
                            const isSelected = selectedDayInfo.members.includes(member.name);

                            return (
                                <div
                                    key={member.id}
                                    onClick={() => handleInputMember(member.name, selectedDayInfo.index)}
                                    className={`sidebar-member ${isSelected ? "selected-member" : ""}`}
                                >
                                    <div>이름 : {member.name} {isSelected && "✅"}</div>
                                    <div>직책 : {member.role}</div>
                                </div>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    )
}