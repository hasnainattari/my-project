import "./App.scss"
import { Routes, Route, Navigate, useNavigate } from "react-router-dom"
import Votes from "./pages/votes"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { login, logout } from "./redux/state"

const App = () => {
  // AUTH GUARD
  const isLogin = useSelector((state: any) => state.isLogin)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    getFirebaseUser()
  }, [])

  const getFirebaseUser = () => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userObj = {
          email: user.email,
          uid: user.uid
        }

        dispatch(login(userObj))

        navigate("/")
      } else {
        navigate("/login")
        dispatch(logout())
      }
    });
  }

  return (
    <Routes>
      {
        (isLogin == null) ?
          <Route path="*" element={<>
            <div
              style={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <span className="loader"></span>
            </div>
          </>} />
          : null
      }
      {
        (isLogin == true) ?
          <>
            <Route path="/" element={<Votes />} />
            <Route path="*" element={<Navigate to="/" />} />
          </> : null
      }
      {
        (isLogin == false) ?
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </> : null
      }
    </Routes>
  )
}

export default App