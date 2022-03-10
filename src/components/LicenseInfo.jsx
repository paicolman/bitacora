import React, { useContext, useState, useEffect } from 'react'
import { ProfileDataContext } from '../contexts/ProfileDataContext'

export default function LicenseInfo() {
  const { getProfileData } = useContext(ProfileDataContext)
  const [dataReady, setDataReady] = useState(false)
  const [licenses, setLicenses] = useState(null)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!dataReady) {
      console.log('Getting data from DB')
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
    <span onClick={loopLicense} className='clickable-title'>{showLicense()}</span>
  )
}
