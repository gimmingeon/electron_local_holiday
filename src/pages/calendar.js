import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addDay, addMember, resetDays, setDays } from "../redux/calendarSlice.js";
import Modal from "react-modal";
import "../css/calendar.css"
import axios from "axios";
import { minusMonthHoliday, setMember } from "../redux/memberSlice.js";
import MemberAutoInput from "./memberAutoInput.js";
import MemberSelfInput from "./memberSelfInput.js";
import * as XLSX from 'xlsx';
import BiweeklyInput from "./biweeklyInput.js";
import HolidayDelete from "./holidayDelete.js";

export default function Calendar() {


    const dispatch = useDispatch();

    const days = useSelector((state) => state.calendar.days)

    // 오늘 날짜
    const [currentDate, setCurrentDate] = useState(dayjs());
    const startOfMonth = currentDate.startOf("month"); // 1일
    const startDay = startOfMonth.day(); // 일요일은 0, 월요일은 1 ...
    const daysInMonth = currentDate.daysInMonth(); // 30일 또는 31일(28일)
    const [holidayCount, setHolidayCount] = useState({});
    const [importData, setImportData] = useState(false);

    // 모달 창 열고 닫기
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [autoModalIsOpen, setAutoModalIsOpen] = useState(false);
    const [biAutoModalIsOpen, setBiAutoModalIsOpen] = useState(false);
    const [saveMonthModalIsOpen, setSaveMonthModalIsOpen] = useState(false);

    // 날짜의 정보와 멤버
    const [selectedDayInfo, setSelectedDayInfo] = useState({ date: '', members: [], index: '' });
    const [selectedMember, setSelectedMember] = useState(null);

    const form = useSelector((state) => state.member.form);
    const members = useSelector((state) => state.member.members);

    const handleGetHoliday = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/holiday/days?year=${currentDate.year()}&month=${currentDate.month() + 1}`)

            if (response.data.length == 0) {
                alert("저장된 휴일이 없습니다.")
            } else {

                if (!importData) {
                    dispatch(setDays(response.data));
                    const memberIds = response.data.flatMap((item, index) => item.members.map(member => member.id))
                    for (let i = 0; i < memberIds.length; i++) {
                        dispatch(minusMonthHoliday(memberIds[i]));
                    }
                    setImportData(true);
                } else {
                    alert("이미 데이터를 불러왔습니다.")
                }

            }

        } catch (error) {
            alert("휴일 조회 실패");
        }
    }

    useEffect(() => {
        setImportData(false);
    }, [currentDate.year(), currentDate.month()])

    useEffect(() => {
        dispatch(resetDays());

        for (let i = 0; i < daysInMonth; i++) {
            const day = i + 1;
            dispatch(addDay({
                index: day,
                day: `${currentDate.format("YYYY-MM")}-${String(day).padStart(2, "0")}`,
            }));
        }

    }, [dispatch, currentDate, daysInMonth]);

    const handleSaveHoliday = async () => {
        try {
            const response = await axios.post("http://localhost:4000/holiday", days);
            alert(response.data.message);

        } catch (error) {
            alert(error.response?.data?.message || "휴일 저장에 실패했습니다.");
        }
    }

    // 한달 휴일 갯수 변경
    const handleUpdateCount = async (memberId) => {
        try {

            const value = holidayCount[memberId];
            const parsedValue = value !== undefined ? Number(value) : 0;

            await axios.patch("http://localhost:4000/member", {
                id: memberId,
                updateHoliday: parsedValue
            });
            setHolidayCount(prev => ({ ...prev, [memberId]: "" }));

            window.location.reload();

        } catch (error) {
            alert(error.response?.data?.message || "휴일 갯수 수정 실패")
        }
    }

    const handleReset = () => {
        window.location.reload();
    }

    const handleGetMember = async () => {
        try {
            const response = await axios.get('http://localhost:4000/member');
            dispatch(setMember(response.data));

        } catch (error) {
            console.log('멤버 불러오기 실패', error);
        }
    };

    // 다음달로 이동
    const handleaddMonth = async () => {

        setCurrentDate(currentDate.add(1, "month"));

        handleGetMember();

    }

    // 이전 달로 이동
    const handlesubtractMonth = () => {

        setCurrentDate(currentDate.subtract(1, "month"));


        handleGetMember();
    }

    const blanks = Array.from({ length: startDay }, (_, i) => <div key={`b-${i}`} className="p-2" />);

    const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

    // 멤버 불러오는 것
    useEffect(() => {

        handleGetMember();
    }, [dispatch]);

    // 모달 열기
    const handleDateClick = (date, members, date_index) => {
        // date와 멤버의 정보를 담음
        setSelectedDayInfo({ date, members, index: date_index });
        // 모달창을 염
        setModalIsOpen(true);
    };

    // 자동 모달 열기
    const handleAutoClick = () => {
        // 모달창을 염
        setAutoModalIsOpen(true);
    };

    const handleBiWeekClick = () => {
        // 모달창을 염
        setBiAutoModalIsOpen(true);
    };

    const handleSaveMonthClick = () => {
        // 모달창을 염
        setSaveMonthModalIsOpen(true);
    };

    // 엑셀로 저장
    const exportDaysExcel = (days, currentDate, startDay) => {
        const weekDays = ["일", '월', '화', '수', '목', '금', '토'];
        const aoa = [weekDays];

        let rowDates = Array(startDay).fill('');      // 앞 공백
        let rowMembers = Array(startDay).fill('');

        for (let i = 0; i < days.length; i++) {
            const dayItem = days[i];
            const dateKey = Object.keys(dayItem).find(k => k !== "member");
            const dateStr = dayItem[dateKey];
            const dayNum = new Date(dateStr).getDate();

            rowDates.push(`${dayNum}일`);
            rowMembers.push(dayItem.member.join(', '));

            // 한 주(7일)씩 끊어서 추가
            if (rowDates.length === 7) {
                aoa.push(rowDates);
                aoa.push(rowMembers);
                rowDates = [];
                rowMembers = [];
            }
        }

        // 마지막에 7일 미만 남은 경우도 추가
        if (rowDates.length > 0) {
            // 7칸 채워서 정렬
            while (rowDates.length < 7) {
                rowDates.push('');
                rowMembers.push('');
            }
            aoa.push(rowDates);
            aoa.push(rowMembers);
        }

        const sheet = XLSX.utils.aoa_to_sheet(aoa);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, sheet, "휴일배정");

        const filename = `${currentDate.format("YYYY-MM")}_휴일배정.xlsx`;
        XLSX.writeFile(workbook, filename);
    };

    return (
        <div className="calendar-layout">
            {/* 사이드바 */}
            <div className="calendar-sidebar-fixed">
                <h2 className="sidebar-title">📅 캘린더</h2>
                <ul className="sidebar-menu">
                    <li onClick={handleAutoClick}>📆 자동 휴일 배정</li>
                    <li onClick={handleBiWeekClick}>📆 격주 휴일 배정</li>
                    <li onClick={() => exportDaysExcel(days, currentDate, startOfMonth.day())}>📊 엑셀 저장</li>
                    <li onClick={handleSaveHoliday}>✔️휴일 저장하기</li>
                    <li onClick={handleGetHoliday}>✔️휴일 불러오기</li>
                    <li onClick={handleSaveMonthClick}>✔️ 휴일 삭제하기</li>
                    <li onClick={handleReset}>📆 새로고침</li>
                </ul>
            </div>

            {/*달력 메인 */}
            <div className="calendar-content">
                <div className="calendar-main">
                    <div className="calendar-header">
                        <button onClick={handlesubtractMonth} className="calendar-nav-btn">이전 달</button>
                        <span className="calendar-title">{currentDate.format("YYYY년 MM월")}</span>
                        <button onClick={handleaddMonth} className="calendar-nav-btn">다음 달</button>
                    </div>

                    <div className="calendar-weekdays">
                        {weekDays.map((day, i) => (
                            <div key={i} className="calendar-weekday">{day}</div>
                        ))}
                    </div>

                    <div className="calendar-grid">
                        {blanks}

                        {/* 직접 멤버 넣기 */}
                        <Modal
                            isOpen={modalIsOpen}
                            onRequestClose={() => setModalIsOpen(false)}
                            contentLabel="날짜 정보"
                            className="custom-modal-content"
                            overlayClassName="modal-overlay"
                        >
                            <MemberSelfInput
                                selectedDayInfo={selectedDayInfo}
                                members={members}
                                setSelectedDayInfo={setSelectedDayInfo}

                            />
                            <button onClick={() => setModalIsOpen(false)}>닫기</button>
                        </Modal>

                        {/* 자동 멤버 넣기 */}
                        <Modal
                            isOpen={autoModalIsOpen}
                            onRequestClose={() => setAutoModalIsOpen(false)}
                            contentLabel="자동 휴일 배정"
                            overlayClassName="modal-overlay"
                            className="custom-modal-content"
                        >
                            <MemberAutoInput days={days} members={members} />
                        </Modal>

                        {/* 격주 멤버 넣기 */}
                        <Modal
                            isOpen={biAutoModalIsOpen}
                            onRequestClose={() => setBiAutoModalIsOpen(false)}
                            contentLabel="격주 휴일 배정"
                            overlayClassName="modal-overlay"
                            className="custom-modal-content"
                        >
                            <BiweeklyInput days={days} members={members} />

                        </Modal>

                        <Modal
                            isOpen={saveMonthModalIsOpen}
                            onRequestClose={() => setSaveMonthModalIsOpen(false)}
                            contentLabel="휴일 삭제"
                            overlayClassName="modal-overlay"
                            className="custom-modal-content"
                        >
                            <HolidayDelete />
                        </Modal>


                        {/* 캘린더 */}
                        {days.map((item, index) => {
                            const key = Object.keys(item).find((k) => k !== "member");
                            const date = item[key];
                            const members = item.member;
                            const date_index = index;

                            // const weekDay = (startDay + index) % 7;
                            // const weekNumber = Math.floor((startDay + index) / 7) + 1;

                            return (
                                <>
                                    <div
                                        key={index}
                                        onClick={() => handleDateClick(date, members, date_index)}
                                        className="calendar-cell"
                                    >
                                        <div className="date-number">{index + 1}</div>
                                        <div className="members">👤 {members.join(", ")}</div>
                                    </div>
                                </>

                            );
                        })}
                    </div>
                </div>
            </div>


            <div className="calendar-sidebar-right">
                <h2 className="sidebar-title">📌 월 휴일</h2>
                <ul className="sidebar-menu">
                    {members.length === 0 ? (<li>멤버가 없습니다</li>) : (
                        members.map((member, index) => (
                            <li
                                key={index}
                                onClick={() =>
                                    setSelectedMember(prevIndex =>
                                        prevIndex === index ? null : index
                                    )
                                }
                            >
                                <span style={{ color: member.monthHoliday < 0 ? 'red' : "black" }}>
                                    {member.name} - 휴일: {member.monthHoliday}개
                                </span>


                                {selectedMember === index && (
                                    <div className="edit-box" onClick={(e) => e.stopPropagation()} >
                                        <input
                                            type="number"
                                            value={holidayCount[member.id] || 0}
                                            onChange={(e) => setHolidayCount(prev => ({
                                                ...prev,
                                                [member.id]: e.target.value
                                            })

                                            )}
                                        />

                                        <button
                                            onClick={() => handleUpdateCount(member.id)}
                                        >등록</button>
                                    </div>
                                )}

                            </li>
                        ))
                    )}

                </ul>
            </div>
        </div>
    );


}