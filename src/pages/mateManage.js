import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMate } from "../redux/mateSlice.js";
import { setMember } from "../redux/memberSlice.js"
import "../css/mateManage.css"

export default function MateManage() {

    const dispatch = useDispatch();
    const mates = useSelector((state) => state.mate.mates);
    const members = useSelector((state) => state.member.members);
    const [registeMate, setRegisteMate] = useState([]);

    const handleGetMate = async () => {
        try {
            const response = await axios.get('http://localhost:4000/mate');
            dispatch(setMate(response.data));
        } catch (error) {
            alert("짝 조회 실패");
        }
    };

    // 멤버, 짝 데이터 불러오기
    useEffect(() => {

        const handleGetMember = async () => {
            try {
                const response = await axios.get('http://localhost:4000/member');
                dispatch(setMember(response.data));
            } catch (error) {
                alert("멤버 조회 실패");
            }
        }

        handleGetMate();
        handleGetMember();

    }, [dispatch]);

    // 짝 만들기
    const handleRegisterMate = async () => {

        if (!(registeMate.length == 2)) {
            alert("등록할 짝은 2명이야 합니다.");
            return;
        }
        try {
            const response = await axios.post('http://localhost:4000/mate', {
                memberAId: registeMate[0],
                memberBId: registeMate[1]
            }
            );

            alert(response.data.message);
            setRegisteMate([]); // 등록 후 상태 초기화
            handleGetMate();
        } catch (error) {
            alert(error.response?.data?.message || "짝 등록에 실패했습니다.");
        }

    }

    // 짝 지정하기
    const handlePlusRegisteMate = (member) => {
        if (registeMate.includes(member.id)) {
            setRegisteMate(registeMate.filter(id => id !== member.id));
        } else if (registeMate.length >= 2) {
            alert("짝은 2명씩 가능합니다.")
            return;
        } else {
            setRegisteMate([...registeMate, member.id])
        }
    }

    // 짝 삭제하기
    const handleDeleteMate = async (mate) => {
        try {
            const response = await axios.delete('http://localhost:4000/mate', {
                data: { id: mate }
            });
            alert(response.data.message);
            handleGetMate();
        } catch (error) {
            alert(error.response?.data?.message || "짝 삭제에 실패했습니다.");
        }
    }

    return (
        <div className="mate-container">
            <h2 className="section-title">짝 만들기</h2>

            <button className="register-button" onClick={handleRegisterMate}>
                짝 등록하기
            </button>

            <h3 className="section-title">멤버 목록</h3>

            {members.length === 0 ? (<li>멤버가 없습니다</li>) :
                (<div className="member-list">
                    {members.map((member) => (
                        <div
                            key={member.id}
                            className={`memberMate-card ${registeMate.includes(member.id) ? "selected" : ""}`}
                            onClick={() => handlePlusRegisteMate(member)}
                        >
                            {member.name}
                        </div>
                    ))}
                </div>)}



            <div className="selected-mates">
                {registeMate.map((mateId) => {
                    const member = members.find((m) => m.id === mateId);
                    return (
                        <div key={mateId} className="selected-mate-card">
                            {member?.name || mateId}
                        </div>
                    );
                })}

            </div>


            <h3 className="section-title">등록된 짝</h3>
            <div className="mate-list">
                {mates.map((mate) => (
                    <div key={mate.id} className="mate-card">

                        <div>멤버 1: {mate.member1Name}</div>
                        <div>멤버 2: {mate.member2Name}</div>
                        <div onClick={() => handleDeleteMate(mate.id)}>짝 삭제</div>
                    </div>
                ))}
            </div>

        </div>
    )
}