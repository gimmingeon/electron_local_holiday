import { useState } from "react";
import { splitMonth } from "../utils/splitMonth";
import { useDispatch } from "react-redux";
import { resetHoliday } from "../redux/calendarSlice";
import "../css/holidayReset.css"
import { plusHolidayName } from "../redux/memberSlice";
import { setFalse } from "../redux/saveSlice";

export default function HolidayReset({ days }) {

    const dispatch = useDispatch();
    const [excludeWeekdays, setExcludeWeekdays] = useState([]);
    const weekMap = ['일', '월', '화', '수', '목', '금', '토'];

    const splitweek = splitMonth(days);

    const handleExcludeWeek = (weekIndex) => {
        const isAlreadyExclude = excludeWeekdays.includes(weekIndex);

        if (!isAlreadyExclude) {
            setExcludeWeekdays([...excludeWeekdays, weekIndex]);
        } else {
            setExcludeWeekdays(excludeWeekdays.filter(week => week != weekIndex))
        }
    }

    const handleResetWeek = (weeks) => {

        dispatch(setFalse());
        weeks.forEach((dayObj) => {
            if (!(excludeWeekdays.includes(dayObj.weekday))) {
                const memberNames = dayObj.members.map(m => m.name);
                dispatch(plusHolidayName(memberNames))
                dispatch(resetHoliday(dayObj));
            }
        });
    }

    return (
        <div className="holiday-reset-container">
            <div className="holiday-reset-title">제외 요일</div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>

                {weekMap.map((week, index) => (
                    <button
                        key={week}
                        onClick={() => handleExcludeWeek(index)}
                        className={`holiday-reset-weekday-button ${excludeWeekdays.includes(index) ? 'selected' : ''}`}
                    >
                        {week}
                    </button>
                ))}
            </div>

            {splitweek.map((weeks, index) => (
                <div
                    key={index}
                    className="holiday-reset-week-row"
                    onClick={() => handleResetWeek(weeks)}
                >
                    {index + 1}번째 주</div>
            ))}
        </div>
    )
}