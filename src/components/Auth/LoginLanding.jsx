import React from "react"
import { useAuth } from "../../contexts/AuthContext"
import { Navigate } from "react-router-dom"
import UpdateProfile from "../UpdateProfile"
import { ProfileDataProvider } from "../../contexts/ProfileDataContext"


export default function LoginLanding() {
  const { currentUser } = useAuth()

  let returnVal = <Navigate to="/login" />

  if (currentUser) {
    console.log(currentUser.uid)
    returnVal = 
      <ProfileDataProvider>
        <UpdateProfile />
      </ProfileDataProvider>
    
  }

  return (returnVal)
}
