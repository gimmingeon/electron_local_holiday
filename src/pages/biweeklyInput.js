import { useState } from "react";
import { useDispatch } from "react-redux";
import '../css/biweeklyInput.css'
import dayjs from "dayjs";
import { addMember } from "../redux/calendarSlice.js";

export default function BiweeklyInput({ days, members }) {

    const dispatch = useDispatch();

    const [readyMember, setReadyMember] = useState(members);
    const weekMap = ['일', '월', '화', '수', '목', '금', '토'];
    const [includeWeekdays, setIncludeWeekdays] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    // const [assignMember, setAssignMember] = useState([]);
    const [oneAssignMember, setOneAssignMember] = useState([]);
    const [twoAssignMember, setTwoAssignMember] = useState([]);

    if (!members || members.length === 0) {
        return <div>멤버가 없습니다.</div>
    }

    // 멤버 검색
    const handleFindMember = (e) => {
        const target = members.filter(member =>
            member.name.includes(e) || member.role.includes(e)
        );
        if (target) {
            setReadyMember(target)
        }
    }

    // 요일 포함
    const handleIncludeWeek = (week) => {
        const isAlreadyInclude = includeWeekdays.includes(week);

        if (!isAlreadyInclude) {
            setIncludeWeekdays([...includeWeekdays, week]);
        } else {
            setIncludeWeekdays(includeWeekdays.filter(weeks => weeks !== week));
        }
    }

    // 첫번째 멤버 추가
    const handlePlusOneAssignMember = (memberName) => {
        const isAlreadyAssignMember = oneAssignMember.includes(memberName);

        if (!isAlreadyAssignMember) {
            setOneAssignMember([...oneAssignMember, memberName]);
        } else {
            setOneAssignMember(oneAssignMember.filter(name => name !== memberName));
        }
    }

    // 두번째 멤버 추가
    const handlePlustwoAssignMember = (memberName) => {
        const isAlreadyAssignMember = twoAssignMember.includes(memberName);

        if (!isAlreadyAssignMember) {
            setTwoAssignMember([...twoAssignMember, memberName]);
        } else {
            setTwoAssignMember(twoAssignMember.filter(name => name !== memberName));
        }
    }

    const handleBiweekAssign = () => {
        const includeWeekIndexes = includeWeekdays.map(w => weekMap.indexOf(w));
        // const oneAssignMember = assignMember.slice(0, assignMember.length / 2);
        // const twoAssignMember = assignMember.slice(Math.floor(assignMember.length / 2), assignMember.length);

        const fullIncluded = days
            .map((obj, index) => {
                const dateStr = Object.values(obj)[0];
                const weekday = dayjs(dateStr).day();
                return { index: index + 1, weekday };
            })
            .filter(({ weekday }) => includeWeekIndexes.includes(weekday))
            .map(({ index }) => index)

        const groupedWeeks = [];
        fullIncluded.forEach(dayIndex => {
            const weekNum = Math.floor((dayIndex - 1) / 7);
            if (!groupedWeeks[weekNum]) groupedWeeks[weekNum] = [];
            groupedWeeks[weekNum].push(dayIndex);
        });

        groupedWeeks.map((week, index) => {
            if (index % 2 === 0) {
                for (let i = 0; i < week.length; i++) {
                    for (let j = 0; j < oneAssignMember.length; j++) {
                        dispatch(addMember({ index: week[i], memberName: oneAssignMember[j] }));
                    }

                }
            } else {
                for (let i = 0; i < week.length; i++) {
                    for (let j = 0; j < twoAssignMember.length; j++) {
                        dispatch(addMember({ index: week[i], memberName: twoAssignMember[j] }))
                    }
                }
            }
        })

    }

    return (
        <div className="biweekly-container">
            <h2>격주 지정</h2>

            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="멤버 이름 또는 직책 검색"
            />
            <button onClick={() => handleFindMember(searchTerm)}>검색</button>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
                {weekMap.map((week) => (
                    <button
                        key={week}
                        onClick={() => handleIncludeWeek(week)}
                        className={`weekdayBi-button ${includeWeekdays.includes(week) ? 'selected' : ''}`}
                    >
                        {week} {includeWeekdays.includes(week)}

                    </button>
                ))}
            </div>

            <div className="assign-button" onClick={() => handleBiweekAssign()}>
                격주 배정
            </div>

            {readyMember.map((member) => {
                const inOne = oneAssignMember.includes(member.name);
                const inTwo = twoAssignMember.includes(member.name);

                // 멤버가 속한 그룹에 따라 클래스 결정
                let groupClass = '';
                if (inOne && inTwo) groupClass = 'group-both';
                else if (inOne) groupClass = 'group-one';
                else if (inTwo) groupClass = 'group-two';

                return (
                    <div key={member.id}>
                        <div className={`memberBiweekly-card ${groupClass}`}>
                            <div>이름: {member.name}</div>
                            <div>분류: {member.role}</div>
                        </div>

                        <div className="group-buttons">
                            <div className="group-button1" onClick={() => handlePlusOneAssignMember(member.name)}>
                                첫번째 그룹
                            </div>
                            <div className="group-button2" onClick={() => handlePlustwoAssignMember(member.name)}>
                                두번째 그룹
                            </div>
                        </div>
                    </div>
                );
            })}


        </div>
    )


}