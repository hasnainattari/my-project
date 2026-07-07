import { Link, useNavigate } from "react-router-dom"
import { AntdButton } from "../companents/AntdButton"
import { AntdInput } from "../companents/AntdInput"
import { PasswordInput } from "../companents/PasswordInput"
import "./index.scss"
import { useState } from "react"
import { message } from "antd"
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { useDispatch } from "react-redux"
import { login } from "../redux/state"

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [email, set_email] = useState("")
  const [password, set_password] = useState("")

  const handleLogin = (e: any) => {
    e.preventDefault()

    if (!email) {
      message.error("email is required")
      return
    }
    if (!password) {
      message.error("password is required")
      return
    }

    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential: any) => {

        const user = userCredential.user;

        const userObj = {
          email: user.email,
          uid: user.uid
        }

        dispatch(login(userObj))
        message.success("login successfull")
        navigate("/")
      })
      .catch((error) => {
        console.error(error)
        message.error(error.message.replace("Firebase: Error", ""))
      });

  }

  const googleLogin = () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result: any) => {
        const userData = {
          email: result.user.email,
          uid: result.user.uid,
        }
        dispatch(login(userData))
        message.success("google login successfull")
        navigate("/")
      }).catch((error) => {
        console.error(error)
        message.error(error.message.replace("Firebase: Error", ""))
      });
  }

  return (
    <form onSubmit={handleLogin} className="login-form">
      <h2>Login</h2>
      <AntdInput placeholder="Enter your email" type="email"
        onChange={(e: any) => set_email(e.target.value)}
        value={email}
      />
      <PasswordInput placeholder="Enter your password"
        onChange={(e: any) => set_password(e.target.value)}
      />
      <p>
        Don't have an account?
        <Link to="/signup"> Signup</Link>
      </p>
      <AntdButton text="Login Now" onClick={handleLogin} />
      <AntdButton text="Continue With Google" onClick={googleLogin} />
    </form>
  )
}

export default Login