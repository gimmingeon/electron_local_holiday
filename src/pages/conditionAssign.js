import axios from "axios";
import { useState } from "react";
import "../css/conditionAssign.css"

export default function ConditionInput({ member }) {

    const [notHoliday, setNotHoliday] = useState([]);
    const [connectNotHoliday, setConnectNotHoliday] = useState(0);

    const handleRegisterCondition = async () => {

        try {
            const response = await axios.post("http://localhost:4000/condition", {
                memberId: member.id,
                notHoliday: notHoliday,
                connectNotHoliday: connectNotHoliday,
            });
            alert(response.data.message || "조건 등록");

            setNotHoliday([]);
            setConnectNotHoliday(0)

            window.location.reload();
        } catch (error) {
            alert(error.response?.data?.message || "조건 등록 실패");
        }
    }

    const weekMap = ["일", "월", "화", "수", "목", "금", "토"]

    const handleNotHolidayWeek = (week) => {

        const weekIndex = weekMap.indexOf(week)

        if (notHoliday.includes(weekIndex)) {
            setNotHoliday(notHoliday.filter(x => x !== weekIndex))
        } else {
            setNotHoliday([...notHoliday, weekIndex])
        }
    }

    const handleDeleteCondition = async () => {
        try {
            const response = await axios.delete("http://localhost:4000/condition", {
                data: { id: member.condition.id }
            });
            alert(response.data.message);
            window.location.reload();
        } catch (error) {
            alert(error.response?.data?.message || "조건 삭제에 실패했습니다.");
        }
    }

    return (
        <div className="conditionAssign-form">
            <div className="conditionAssign-member-name">이름 : {member.name}</div>


            <label>휴일 금지</label>
            <div className="conditionAssign-weekday-group">
                {weekMap.map((week, idx) => {
                    const weekIndex = weekMap.indexOf(week);
                    const isSelected = notHoliday.includes(weekIndex);

                    return (
                        <div
                            key={`not-${idx}`}
                            className={`conditionAssign-weekday-button ${isSelected ? "selected" : ""}`}
                            onClick={() => handleNotHolidayWeek(week)}
                        >
                            {week}
                        </div>
                    );
                })}
            </div>

            <label>휴일 연속 금지</label>
            <input
                type="number"
                min={0}
                max={6}
                value={connectNotHoliday}
                onChange={(e) => setConnectNotHoliday(Number(e.target.value))}
            />

            <button onClick={handleRegisterCondition}>등록</button>

            <button onClick={handleDeleteCondition}>조건 삭제</button>
        </div>

    )
}