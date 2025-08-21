import dayjs from "dayjs";
import { addMember, resetWeek } from "../redux/calendarSlice.js";
import { toggleMemberWithHoliday } from "../thunk/calendarThunks.js";
import { useDispatch } from "react-redux";
import { setFalse } from "../redux/saveSlice.js";
import { failAutoReset } from "../thunk/failAutoThunk.js";

export default function handleAutoAssign({
    autoReadyMember, excludeWeekdays, weekMap, weeks, dispatch
}) {

    dispatch(setFalse());
    const originalWeeks = JSON.parse(JSON.stringify(weeks));
    const excludeWeekIndexes = excludeWeekdays.map(w => weekMap.indexOf(w));
    let dayNum = 0;
    let attempts = 0;
    let notHoliday = [];
    let connectNotHoliday = 0;

    const weekMapNumber = weeks
        .map((obj, index) => {
            // 객체에서 값만 꺼냄 -> '2025-05-01' 같은 문자열
            const dateStr = Object.values(obj)[0];
            // 날짜의 요일을 숫자로 반환 (일요일: 0, 월요일: 1, ..., 토요일: 6)
            const weekday = dayjs(dateStr).day();
            return { index, weekday };
        });

    const fullExcluded = weekMapNumber
        // 제외인 요일 필터링 (요일이 6또는 0인 경우만 필터링)
        .filter(({ weekday }) => excludeWeekIndexes.includes(weekday))
        // index만 추출
        .map(({ index }) => index)

    const shuffleDays = weeks.map((day, index) => {
        const key = Object.keys(day).find(k => k.startsWith("day"));
        return {
            [key]: day[key],
            index,
            weekday: day.weekday,
            members: Array.isArray(day.members) ? [...day.members] : []
        };
    }).sort(() => Math.random() - 0.5);;

    const moveNextDay = () => {
        dayNum++;
        if (dayNum === shuffleDays.length) {
            dayNum = 0;
            shuffleDays.sort(() => Math.random() - 0.5);
        }
    };

    for (let i = 0; i < autoReadyMember.length; i++) {

        if (autoReadyMember[i].condition?.notHoliday) {
            notHoliday = autoReadyMember[i].condition.notHoliday.map(Number);
        }

        if (autoReadyMember[i].condition?.connectNotHoliday) {
            connectNotHoliday = autoReadyMember[i].condition?.connectNotHoliday;
        }

        for (let j = 0; j < autoReadyMember[i].holiday_count; j++) {

            attempts++;

            if (attempts > 10000) {
                // alert();
                window.electronApi.showAlert("자동 배정 중단: 조건을 만족할 수 없습니다.");

                // dispatch(resetWeek(originalWeeks));
                dispatch(failAutoReset(originalWeeks));

                return;
            }

            // const currentDay = shuffleDays[dayNum];
            // const currentDateStr = Object.values(currentDay)[0];
            // const currentIndex = currentDay.index
            // const currentDate = dayjs(currentDateStr);
            // const assignedMembers = currentDay.member || [];
            // const memberName = autoReadyMember[i].name;
            // const memberId = autoReadyMember[i].id;
            // const currentWeekday = currentDate.day();

            const currentDay = shuffleDays[dayNum];
            const key = Object.keys(currentDay).find(k => k.startsWith("day"));
            const currentDateStr = currentDay[key]; // 확실히 날짜만 가져옴
            const currentDate = dayjs(currentDateStr);
            const currentIndex = currentDay.index;
            const assignedMembers = currentDay.members || [];
            const memberName = autoReadyMember[i].name;
            const memberId = autoReadyMember[i].id;
            const currentWeekday = currentDay.weekday;


            if (connectNotHoliday > 0 && attempts <= 5000) {

                // 멤버가 있는 날을 추출해서 날짜값을 선택한다
                // 예시
                /*
                    [ dayjs('2025-06-01'), dayjs('2025-06-05') ]
                */

                const assignedDatesForMember = shuffleDays
                    .filter(day => (day.members || []).some(m => m.name === memberName))
                    .map(day => dayjs(Object.values(day)[0]));

                // 
                const dates = [
                    ...assignedDatesForMember.map(d => d.startOf('day')),
                    currentDate.startOf('day')
                ].sort((a, b) => a.unix() - b.unix());

                // let filteredDates = dates.filter(d => d.day() !== 0); // 일요일(0) 제외
                // let consecutiveCount = 1;
                // let hasConnectConflict = false;

                // for (let k = 1; k < filteredDates.length; k++) {
                //     const prev = filteredDates[k - 1];
                //     const curr = filteredDates[k];

                //     const diff = curr.diff(prev, 'day');

                //     if (diff === 1) {
                //         consecutiveCount++;
                //         if (consecutiveCount >= connectNotHoliday) {
                //             hasConnectConflict = true;
                //             break;
                //         }
                //     } else {
                //         consecutiveCount = 1;
                //     }
                // }

                let consecutiveCount = 1;
                let hasConnectConflict = false;

                for (let k = 1; k < dates.length; k++) {
                    const diff = dates[k].diff(dates[k - 1], 'day');
                    if (diff === 1) {
                        consecutiveCount++;
                        if (consecutiveCount >= connectNotHoliday) {
                            hasConnectConflict = true;
                            break;
                        }
                    } else {
                        consecutiveCount = 1; // 연속이 끊겼으니 초기화
                    }
                }

                // 연속 휴일 금지
                if (hasConnectConflict) {
                    moveNextDay();
                    j--; // 같은 멤버 반복
                    continue;
                }

                // 개인 휴일 금지
                if (notHoliday.includes(currentWeekday)) {
                    moveNextDay();
                    j--; // 같은 멤버 반복
                    continue;
                }
            }

            if (connectNotHoliday > 0 && attempts > 5000 && attempts <= 5001) {
                // alert()
                window.electronApi.showAlert("휴일 지양 모드 변경");
            }

            // 제외 요일
            if (fullExcluded.includes(currentIndex)) {
                moveNextDay();
                j--; // 같은 멤버 반복
                continue;
            }

            const mates = autoReadyMember[i].mate || [];

            // some 함수 : 하나라도 만족하면 true를 반환한다
            const hasMateConflict = assignedMembers.some(
                assigned => mates.includes(assigned.name)
            );

            if (hasMateConflict) {
                moveNextDay();
                j--; // 같은 멤버 반복
                continue;
            }

            if (currentDay.members?.some(m => m.name === autoReadyMember[i].name)) {
                moveNextDay();
                j--; // 같은 멤버 반복
                continue;
            }
            const dayKey = Object.keys(currentDay).find(key => key.startsWith("day"));
            const dayIndex = Number(dayKey.replace("day", ""));

            if (!Array.isArray(currentDay.members)) {
                currentDay.members = [];
            }

            // if (!currentDay.member) {
            //     currentDay.member = [];
            // }
            currentDay.members.push({ name: memberName, type: "nonAnnunal" });

            //dispatch(addMember({ index: dayIndex, memberName }));
            dispatch(toggleMemberWithHoliday({ index: dayIndex, memberName, memberId }))

            dayNum++;

            if (dayNum === shuffleDays.length) {
                dayNum = 0;
                shuffleDays.sort(() => Math.random() - 0.5);
            }
        }
    }


}