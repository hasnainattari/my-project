import { useSelector } from "react-redux"
import { AntdButton } from "./AntdButton"
import { getAuth, signOut } from "firebase/auth";
import "./index.scss"
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const currentUser = useSelector((state: any) => state.user)
    const navigate = useNavigate()

    const logout = () => {
        const auth = getAuth();
        signOut(auth).then(() => {
            message.success("Logout successful")
            navigate("/login")
        }).catch((error) => {
            message.error("Error in logout")
            console.error(error)
        });
    }

    return (
        <div className="header">
            <div className="brand">
                <svg className="brand-mark" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="10" width="34" height="24" rx="2" stroke="#1c2438" strokeWidth="2.2" fill="#eef0ea" />
                    <path d="M3 16 L20 26 L37 16" stroke="#1c2438" strokeWidth="2.2" strokeLinejoin="round" fill="none" />
                    <circle cx="20" cy="10" r="4" fill="#b23a2e" />
                </svg>
                <h3>Ballot</h3>
                <span className="tag">live polls</span>
            </div>
            <div className="who">
                <span className="email-chip">{currentUser?.email}</span>
                <AntdButton text="Logout" onClick={logout} />
            </div>
        </div>
    )
}

export default Header
