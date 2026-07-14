import { Link, useNavigate } from "react-router-dom"
import { AntdButton } from "../companents/AntdButton"
import { AntdInput } from "../companents/AntdInput"
import { PasswordInput } from "../companents/PasswordInput"
import "./index.scss"
import { useEffect, useState } from "react"
import { message } from "antd"
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult
} from "firebase/auth";
import { login } from "../redux/state"
import { useDispatch } from "react-redux"

const Signup = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [email, set_email] = useState("")
  const [password, set_password] = useState("")
  const [confirm_pass, set_confirm_pass] = useState("")

  useEffect(() => {
    const auth = getAuth();
    getRedirectResult(auth)
      .then((result: any) => {
        if (result && result.user) {
          const userData = {
            email: result.user.email,
            uid: result.user.uid,
          }
          dispatch(login(userData))
          message.success("google login successfull")
          navigate("/")
        }
      })
      .catch((error) => {
        console.error(error)
        message.error(error.message.replace("Firebase: Error", ""))
      });
  }, [])

  const handleSignup = (e: any) => {
    e.preventDefault()

    if (!email) {
      message.error("email is required")
      return
    }

    if (!password) {
      message.error("password is required")
      return
    }

    if (password !== confirm_pass) {
      message.error("passwords do not match")
      return
    }

    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential: any) => {
        const user = userCredential.user;
        console.log(user)
        message.success("signup successfull")
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
    signInWithRedirect(auth, provider);
  }

  return (
    <form onSubmit={handleSignup} className="login-form">
      <h2>Signup</h2>
      <AntdInput placeholder="Enter your email" type="email"
        onChange={(e: any) => set_email(e.target.value)}
        value={email}
      />
      <PasswordInput placeholder="Enter your password"
        onChange={(e: any) => set_password(e.target.value)}
      />
      <PasswordInput placeholder="Confirm your password"
        onChange={(e: any) => set_confirm_pass(e.target.value)}
      />
      <p>
        Already have an account?
        <Link to="/login"> Login</Link>
      </p>
      <AntdButton text="Signup Now" onClick={handleSignup} />
      <AntdButton text="Continue With Google" onClick={googleLogin} />
    </form>
  )
}

export default Signup