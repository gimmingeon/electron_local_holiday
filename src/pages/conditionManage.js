import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { mergeMemberWithCondition, setMember } from "../redux/memberSlice.js";
import "../css/conditionManage.css"
import Modal from "react-modal";
import ConditionInput from "./conditionAssign.js";
import ConditionInputFullMember from "./conditionFullMember.js";

export default function ConditionManage() {
    const dispatch = useDispatch();
    const members = useSelector((state) => state.member.members);
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [memberConditionInfo, setMemberConditionInfo] = useState({});
    const [modalFullOpen, setModalFullOpen] = useState(false);

    useEffect(() => {
        const handleGetMember = async () => {
            try {
                const memberRes = await axios.get('http://localhost:4000/member');
                const conditionRes = await axios.get('http://localhost:4000/condition');

                dispatch(mergeMemberWithCondition({ members: memberRes.data, conditions: conditionRes.data }));
            } catch (error) {
                // alert(error.response?.data?.message || "멤버 조회에 실패했습니다.")
            }
        }

        handleGetMember();
    }, [dispatch]);

    const weekMap = ["일", "월", "화", "수", "목", "금", "토"];

    const handleOpenModal = (member) => {
        setMemberConditionInfo(member);
        setModalIsOpen(true);
    }

    const handleOpenFullModal = () => {
        setModalFullOpen(true);
    }

    return (
        <div className="condition-container">

            <button className="condition-fullModal-button" onClick={handleOpenFullModal}>멤버 전체 수정</button>

            {members.length === 0 ? (<h4>멤버가 없습니다</h4>) : (
                <div>
                    {members.map((member) => {
                        return (
                            <div key={member.id} className="memberCondition-card" onClick={() => handleOpenModal(member)}>
                                <div className="member-name">이름: {member.name}</div>
                                {member.condition ? (
                                    <div className="member-condition">
                                        <div><strong>휴일 금지:</strong> {member.condition.notHoliday.map(num => weekMap[+num]).join(', ')}</div>
                                        <div><strong>휴일 연속 금지:</strong> {member.condition.connectNotHoliday}</div>
                                    </div>
                                ) : (
                                    <div className="no-condition">조건 없음</div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}


            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="조건 넣기"
                overlayClassName="modal-overlay"
                className="modal-content"
            >
                <ConditionInput member={memberConditionInfo} />
            </Modal>

            <Modal
                isOpen={modalFullOpen}
                onRequestClose={() => setModalFullOpen(false)}
                contentLabel="조건 전체 수정"
                overlayClassName="modal-overlay"
                className="modal-content"
            >
                <ConditionInputFullMember />
            </Modal>
        </div>
    )

}