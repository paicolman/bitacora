import React, { useContext, useState, useEffect } from 'react'
import { ProfileDataContext } from '../../contexts/ProfileDataContext'
import { FlightContext } from '../../contexts/FlightContext'

export default function LicenseInfo() {
  const { getProfileData } = useContext(ProfileDataContext)
  const { setUsedLicense } = useContext(FlightContext)
  const [dataReady, setDataReady] = useState(false)
  const [licenses, setLicenses] = useState(null)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!dataReady) {
      getDataFromDb()
    }
  }, [])

  async function getDataFromDb() {
    const licensesFromDb = await getProfileData('/profile/licenses')
    const defaultIndex = licensesFromDb.findIndex(license => {
      return license.default
    })
    setLicenses(licensesFromDb)
    setIndex(defaultIndex)
    setDataReady(true)
  }

  function showLicense() {
    if (licenses) {
      setUsedLicense(licenses[index])
      return licenses[index].id
    } else {
      return '?'
    }
  }

  function loopLicense() {
    if (index < (licenses.length - 1)) {
      setIndex(index + 1)
    } else {
      setIndex(0)
    }
  }

  return (
    <h3 onClick={loopLicense} className='clickable-title'>{showLicense()}</h3>
  )
}
