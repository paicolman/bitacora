import React, { useContext, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { ProfileDataContext } from '../../contexts/ProfileDataContext'
import PilotDashboard from '../Dashboard/PilotDashboard'
import FlightContainer from './FlightContainer'

export default function NewFlight() {
  const [userStatus, setUserStatus] = useState('waiting')
  const { pilotIsRegistered } = useContext(ProfileDataContext)

  const pilotRegisteredCheck = async () => {
    const registrationStatus = await pilotIsRegistered()
    setUserStatus(registrationStatus)
  }

  function switchStatus() {
    pilotRegisteredCheck()
    let retval = (<div><h1>AN ERROR HAS OCCURED!</h1></div>)
    switch (userStatus) {
      case 'waiting':
        retval = <div><h4>Please wait...</h4></div>
        break
      case 'inexistent':
        retval = <Navigate to="/login" />
        break
      case 'unregistered':
        retval = <PilotDashboard newPilot={true} />
        break
      case 'registered':
        retval = <FlightContainer />
        break
      default:
        break
    }
    return retval
  }

  return (switchStatus())
}