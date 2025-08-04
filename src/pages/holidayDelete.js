import axios from "axios";
import { useEffect, useState } from "react";
import "../css/holidayDelete.css"

export default function HolidayDelete() {

    const [saveMonth, setSaveMonth] = useState([]);

    useEffect(() => {
        const handleGetMonth = async () => {
            try {
                const response = await axios.get('http://localhost:4000/holiday/month')

                setSaveMonth(response.data);
            } catch (error) {
                // alert(error.response?.data?.message || "휴일 조회에 실패했습니다.")
            }
        }
        handleGetMonth();
    }, [])

    const handleDeleteMonth = async (month) => {
        try {
            await axios.delete('http://localhost:4000/holiday', {
                data: { yearMonth: month }
            })
            // alert(`${month} 휴일 삭제 성공`);
            window.electronApi.showAlert(`${month} 휴일 삭제 성공`);

            const response = await axios.get('http://localhost:4000/holiday/month');
            setSaveMonth(response.data);
        } catch (error) {
            // alert(error.response?.data?.message || "휴일 삭제에 실패했습니다.");
            window.electronApi.showAlert(error.response?.data?.message || "휴일 삭제에 실패했습니다.");
        }
    }

    if (saveMonth.length === 0) {
        return <div className="holiday-delete-container">저장된 휴일이 없습니다.</div>;

    }

    return (
        <div className="holiday-delete-container">
            <div className="holiday-delete-title">저장된 휴일 삭제하기</div>
            <div className="holiday-delete-list">
                {saveMonth.map((month, index) => (
                    <button
                        onClick={() => handleDeleteMonth(month)}
                        key={index}
                        className="holiday-delete-button"
                    >
                        {month} 삭제
                    </button>
                ))}
            </div>
        </div>
    );
}