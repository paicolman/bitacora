import React, { useState, useContext } from 'react'
import { ProfileDataContext } from '../../contexts/ProfileDataContext'
import { Badge, Card, ListGroup } from 'react-bootstrap'
import EditLicenses from './EditLicenses'

export default function ShowLicenses() {
  const { getProfileData, updateProfileData } = useContext(ProfileDataContext)
  const [dataReady, setDataReady] = useState(false)
  const [licenses, setLicenses] = useState(null)
  const [openDlg, setOpenDlg] = useState(null)


  async function getDataFromDb() {
    if (!dataReady) {
      const data = await getProfileData('/profile/licenses')
      setLicenses(data)
      setDataReady(true)
    }
  }

  if (!dataReady) {
    getDataFromDb()
  }

  function licenseList() {
    if (licenses === null) {
      return <p>No licenses</p>
    } else {
      const retVal = licenses.map((license, idx) => {
        return <ListGroup.Item key={`lic-${idx}`}>{license.id}</ListGroup.Item>
      })
      return retVal
    }

  }

  function handleOpenDlg() {
    const props = {
      licenses: licenses,
      onClose: onClose
    }
    setOpenDlg(<EditLicenses props={props} />)
  }

  function onClose(dialogData) {
    console.log(dialogData)
    if (dialogData) {
      updateProfileData('/profile/licenses', dialogData.licenses, () => {
        setDataReady(false)
      })
    }
    setOpenDlg(null)
  }

  return (
    <>
      <div className={'licenses-container'}>
        <h4>Licenses</h4>
        <ListGroup variant="flush" >
          {licenseList()}
        </ListGroup>
      </div>
      <Badge pill bg="primary" onClick={handleOpenDlg}>
        Change this
      </Badge>
      <div id='licensesPopup'>
        {openDlg}
      </div>
    </>
  )
}
