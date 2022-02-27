import React from "react"
import Signup from "./Auth/Signup"
import { Container } from "react-bootstrap"
import { AuthProvider } from "../contexts/AuthContext"
import { BrowserRouter as Navigate, Routes, Route } from "react-router-dom"
import LoginLanding from "./Auth/LoginLanding"
import Login from "./Auth/Login"
import ForgotPassword from "./Auth/ForgotPassword"

function App() {
  return (
    <Navigate>
      <AuthProvider>
        <Routes>
          <Route exact path="/" element={<LoginLanding />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </AuthProvider>
    </Navigate>
  )
}

export default App
