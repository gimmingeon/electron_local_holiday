import dayjs from "dayjs";

export function splitMonth(days) {

    // 결과를 저장하는 주별 배열
    const weeks = [];
    // 지금 만드는 현재 주의 날짜 목록을 담는 임시 배열
    let currentWeek = [];

    for (let i = 0; i < days.length; i++) {

        // 현재 순회중인 day 객체를 변수에 저장한다.
        const dayobj = days[i];
        // 객체 key 중 day로 시작하는 키를 찾는다. 예) day1, day4, day7 ...
        const key = Object.keys(dayobj).find(k => k.startsWith("day"));
        // 찾은 키를 이용해 날짜 문자열을 가져온다 예) 2025-06-07
        const dateStr = dayobj[key];
        // 문자열을 dayjs 객체로 변환한다
        const date = dayjs(dateStr);
        // 해당 날짜의 요일을 구한다 0~6 사이의 숫자가 나온다.
        const weekday = date.day();

        // { day1: "2025-06-01", member: [], date: "2025-06-01", weekday: 0 }로 만든다. 요일 추가됨됨
        const newDayObj = { ...dayobj, weekday };

        // weeks가 비어있으면 첫 주
        if (weeks.length === 0) {
            //현재 주 배열에 날짜 객체를 추가한다.
            currentWeek.push(newDayObj);

            // 현재 날짜가 토요일이거나 마지막 날짜면 지금짜지 쌓은 currentWeek를 weeks에 추가한다
            if (weekday === 6 || i === days.length - 1) {
                weeks.push(currentWeek);
                // 다음 주를 위해 초기화화
                currentWeek = [];
            }
            // 첫 주가 아닌 경우 즉 두번째 주 이후인 경우우
        } else {
            currentWeek.push(newDayObj);

            // 현재 날짜가 토요일이거나 마지막 날짜면 지금짜지 쌓은 currentWeek를 weeks에 추가한다
            if (weekday === 6 || i === days.length - 1) {
                weeks.push(currentWeek);
                currentWeek = [];
            }
        }
    }

    // 최종적으로 나눠진 주별 배열들 반환
    return weeks
}