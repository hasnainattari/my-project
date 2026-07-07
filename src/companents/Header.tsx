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
            <h3>Polling App</h3>
            <div>
                <b>{currentUser?.email}</b>
                <AntdButton text="Logout" onClick={logout} />
            </div>
        </div>
    )
}

export default Header