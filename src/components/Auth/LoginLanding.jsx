import React from "react"
import { useAuth } from "../../contexts/AuthContext"
import { Navigate } from "react-router-dom"
import UpdateProfile from "../UpdateProfile"
import { PilotDataProvider } from "../../contexts/PilotDataContext"


export default function LoginLanding() {
  const { currentUser } = useAuth()

  let returnVal = <><Navigate to="/login" /></>

  if (currentUser) {
    console.log(currentUser.uid)
    returnVal =
      <>
        <PilotDataProvider>
          <UpdateProfile />
        </PilotDataProvider>
      </>
  }

  return (
    <>
      {returnVal}
    </>
  )
}
