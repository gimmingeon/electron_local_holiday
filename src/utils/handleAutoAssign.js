import dayjs from "dayjs";
import { addMember } from "../redux/calendarSlice.js";
// 휴일 자동 배정

export default function handleAutoAssign({
    autoReadyMember, excludeWeekdays, weekMap, weeks, dispatch
}) {

    const assignMember = [];
    let memberNum = 0;
    let dayNum = 0;

    // weekMap([월, 화, 수, 목, 금,토,일])을 [1,2,3,4,5,6,0]으로 변환
    const excludeWeekIndexes = excludeWeekdays.map(w => weekMap.indexOf(w));

    // 휴일의 개수만큼 멤버 곱하기 
    for (let member of autoReadyMember) {
        for (let i = 0; i < member.holiday_count; i++) {
            assignMember.push({ ...member })
        }
    }


    // 제외 요일 추출하기 (더 주석 필요)
    const fullExcluded = weeks
        .map((obj, index) => {
            // 객체에서 값만 꺼냄 -> '2025-05-01' 같은 문자열
            const dateStr = Object.values(obj)[0];
            // 날짜의 요일을 숫자로 반환 (일요일: 0, 월요일: 1, ..., 토요일: 6)
            const weekday = dayjs(dateStr).day();
            return { index: index, weekday };
        })
        // 제외인 요일 필터링 (요일이 6또는 0인 경우만 필터링)
        .filter(({ weekday }) => excludeWeekIndexes.includes(weekday))
        // index만 추출
        .map(({ index }) => index)

    // const fullExcluded = days
    //   .map((obj, index) => {
    //     const dateStr = Object.values(obj)[0];         // '2025-05-01' 같은 날짜 문자열
    //     const weekday = dayjs(dateStr).day();           // 해당 날짜의 요일 (0~6)
    //     return { index: index + 1, weekday };           // index: 1부터 시작하는 날짜 순번
    //   })
    //   .filter(({ weekday }) => excludeWeekIndexes.includes(weekday)) // 제외 요일 필터링
    //   .map(({ index }) => index);                       // 최종적으로 제외할 날짜의 index만 추출


    // 날짜 섞기
    // const shuffleDays = [...Array(weeks.length).keys()].map(i => i + 1).sort(() => Math.random() - 0.5);

    const shuffleDays = weeks.map(obj =>
        Number(Object.keys(obj).find(k => k.startsWith("day")).slice(3))
    ).sort(() => Math.random() - 0.5);

    // 요일 자동 배정
    while (memberNum < assignMember.length) {

        const dayIndex = shuffleDays[dayNum];
        const exclude = shuffleDays[dayNum].weekday;

        const memberName = assignMember[memberNum].name;

        // 제외 요일 확인하고 넘기기
        if (fullExcluded.includes(exclude)) {

            dayNum++;
            if (dayNum === shuffleDays.length) {
                dayNum = 0;
                shuffleDays.sort(() => Math.random() - 0.5);
            }
            continue;
        }

        dispatch(addMember({ index: dayIndex, memberName }));

        memberNum = memberNum + 1;
        dayNum = dayNum + 1;

        if (dayNum === shuffleDays.length) {
            dayNum = 0;
            shuffleDays.sort(() => Math.random() - 0.5);
        }

    }

    // while () {

    // }

}