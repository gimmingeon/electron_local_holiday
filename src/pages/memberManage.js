import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMember, updateForm, addMember, resetForm } from "../redux/memberSlice.js";
import { useEffect, useRef, useState } from "react";
import '../css/memberManage.css'
import { useNavigate } from "react-router-dom";

export default function MemberManage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const nameInputRef = useRef(null);
    const roleInputRef = useRef(null); // 직책 입력창용 ref

    const form = useSelector((state) => state.member.form);
    const members = useSelector((state) => state.member.members);

    useEffect(() => {
        const handleGetMember = async () => {
            try {
                const response = await axios.get('http://localhost:4000/member');
                dispatch(setMember(response.data));
            } catch (error) {
                console.log('멤버 불러오기 실패', error);
            }
        };

        handleGetMember();
    }, [dispatch]);

    const handleRegisterMember = async (e) => {
        e.preventDefault();

        if (!form.name.trim() || !form.role.trim()) {
            // alert();
            window.electronApi.showAlert("이름과 직책 모두 입력해주세요.");

            return;
        }

        try {
            const response = await axios.post('http://localhost:4000/member', form);

            dispatch(addMember(response.data));
            dispatch(resetForm());

            setTimeout(() => {
                nameInputRef.current?.focus();
            }, 0);
            // alert();
            window.electronApi.showAlert("멤버가 등록되었습니다.");
        } catch (error) {
            console.error("멤버 등록 실패", error);
            //  alert();
            window.electronApi.showAlert("멤버 등록에 실패했습니다.");
        }
    };

    const handleDeleteMember = async (id) => {
        try {
            const response = await axios.delete('http://localhost:4000/member', {
                data: { id }
            })

            dispatch(setMember(members.filter(member => member.id !== id)));
            // alert();
            window.electronApi.showAlert(response.data.messege || "멤버가 삭제됬습니다.");
        } catch (error) {
            console.error("멤버 삭제 실패", error);
        }
    }

    const handleKeyDownName = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            roleInputRef.current?.focus(); // 직책으로 이동
        }
    }

    const handleKeyDownRole = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleRegisterMember(e);
        }
    }

    // const handleUpdateMember = async (e, memberName) => {
    //     e.preventDefault();
    //     try {
    //         const response = await axios.patch('/member', {
    //             "name": memberName,
    //             "updateName": form.name,
    //             "updateRole": form.role
    //         })
    //     } catch (error) {

    //     }
    // }

    return (
        <div className="member-manage-container">
            <h1>👤 멤버 관리</h1>

            <button className="back-button" onClick={() => navigate(-1)}>← 뒤로가기</button>

            <form onSubmit={handleRegisterMember}>
                <div>
                    <label>이름</label>
                    <input
                        type="text"
                        ref={nameInputRef}
                        value={form.name}
                        onChange={(e) =>
                            dispatch(updateForm({ field: 'name', value: e.target.value }))
                        }
                        onKeyDown={handleKeyDownName}
                    />
                </div>
                <div>
                    <label>직책</label>
                    <input
                        type="text"
                        ref={roleInputRef}
                        value={form.role}
                        onChange={(e) =>
                            dispatch(updateForm({ field: 'role', value: e.target.value }))
                        }
                        onKeyDown={handleKeyDownRole}
                    />
                </div>

                <button type="submit">등록</button>
            </form>

            <h2>멤버 목록</h2>

            {members.length === 0 ? (
                <p>멤버가 없습니다</p>
            ) : (
                <ul className="member-list">
                    {members.map((member) => (
                        <li key={member.id}>
                            <h2>이름 : {member.name}</h2>
                            <h2>직책 : {member.role}</h2>
                            <button onClick={() => handleDeleteMember(member.id)}>멤버 삭제</button>
                            {/* <form onSubmit={() => handleUpdateMember(member.name)}>
                                <div>
                                    <label>이름</label>
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) =>
                                            dispatch(updateForm({ field: "name", value: e.target.value }))
                                        }
                                    />
                                </div>
                                <div>
                                    <label>직책</label>
                                    <input
                                        type="text"
                                        value={form.role}
                                        onChange={(e) =>
                                            dispatch(updateForm({ field: 'role', value: e.target.value }))
                                        }
                                    />
                                </div>
                                <button type="submit">수정정</button>
                            </form> */}
                        </li>
                    ))}
                </ul>
            )}

        </div>
    )
}