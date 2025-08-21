// src/components/GuardedLink.js
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setTrue } from "../redux/saveSlice";

export default function GuardedLink({ to, children, className }) {
    const save = useSelector((state) => state.save.save);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleClick = async (e) => {
        e.preventDefault();
        if (!save) {
            const res = await window.electronApi.showUnsavedDialog();
            if (res === 0) {
                navigate(to); // "예" → 이동
                dispatch(setTrue());
            }
            // "아니요" → 이동 취소
        } else {
            navigate(to); // 저장돼 있으면 이동
        }
    };

    return (
        <a href="#" className={className} onClick={handleClick}>
            {children}
        </a>
    );
}
