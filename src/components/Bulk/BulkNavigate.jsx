import React, { useContext, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { ProfileDataContext } from '../../contexts/ProfileDataContext'
import PilotDashboard from '../dashboard/PilotDashboard'
import PleaseWait from '../PleaseWait'
import BulkUploadDropzone from './BulkUploadDropzone'

export default function BulkNavigate() {
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
        retval = <PleaseWait />
        break
      case 'inexistent':
        retval = <Navigate to='/login' />
        break
      case 'unregistered':
        retval = <PilotDashboard newPilot={true} />
        break
      case 'registered':
        retval = <BulkUploadDropzone />
        break
      default:
        break
    }
    return retval
  }

  return (switchStatus())
}