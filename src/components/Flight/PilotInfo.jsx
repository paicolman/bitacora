import React, { useContext, useState, useEffect } from 'react'
import { ProfileDataContext } from '../../contexts/ProfileDataContext'
import LicenseInfo from './LicenseInfo'

export default function PilotInfo() {
  const { getProfileData } = useContext(ProfileDataContext)
  const [dataReady, setDataReady] = useState(false)
  const [pilot, setPilot] = useState('Pilot')

  useEffect(() => {
    if (!dataReady) {
      getDataFromDb()
    }
  }, [])

  async function getDataFromDb() {
    const data = await getProfileData('/profile/mainData')
    setPilot(data.pilotName)
    setDataReady(true)
  }

  return (
    <>
      <h1>{pilot}</h1>
      <LicenseInfo />
    </>

  )
}
