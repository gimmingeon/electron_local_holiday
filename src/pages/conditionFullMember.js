import axios from "axios";
import { useState } from "react";
import "../css/conditionAssign.css"
import { useSelector } from "react-redux";

export default function ConditionInputFullMember() {

    const [notHoliday, setNotHoliday] = useState([]);
    const [connectNotHoliday, setConnectNotHoliday] = useState(0);
    const members = useSelector((state) => state.member.members);

    const handleRegisterCondition = async () => {

        try {

            const posts = members.map((member) => {
                axios.post("http://localhost:4000/condition", {
                    memberId: member.id,
                    notHoliday: notHoliday,
                    connectNotHoliday: connectNotHoliday,
                });
            })

            await Promise.all(posts);

            // alert(response.data.message || "조건 등록");

            setNotHoliday([]);
            setConnectNotHoliday(0)

            window.location.reload();
        } catch (error) {
            //alert(error.response?.data?.message || "조건 등록 실패");
            window.electronApi.showAlert(error.response?.data?.message || "조건 등록 실패");
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

    return (
        <div className="conditionAssign-form">
            <div className="conditionAssign-member-name">전체 멤버</div>


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
        </div>

    )
}