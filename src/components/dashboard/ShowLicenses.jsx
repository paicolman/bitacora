import React, { useState, useContext } from 'react'
import { ProfileDataContext } from '../../contexts/ProfileDataContext'
import { Badge, Card, ListGroup } from 'react-bootstrap'
import EditLicenses from './EditLicenses'

export default function ShowLicenses() {
  const { getMainOrLicenceData, updateMainOrLicenceData } = useContext(ProfileDataContext)
  const [dataReady, setDataReady] = useState(false)
  const [licenses, setLicenses] = useState(null)
  const [openDlg, setOpenDlg] = useState(null)


  async function getDataFromDb() {
    if (!dataReady) {
      const data = await getMainOrLicenceData('/profile/licenses')
      setLicenses(data)
      setDataReady(true)
    }
  }

  if (!dataReady) {
    getDataFromDb()
    console.log(licenses)
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
      updateMainOrLicenceData('/profile/licenses', dialogData.licenses, () => {
        setDataReady(false)
      })
    }
    setOpenDlg(null)
  }

  return (
    <>
      <Card className='licenses-card'>
        <Card.Header>Licenses</Card.Header>
        <ListGroup variant="flush" >
          {licenseList()}
        </ListGroup>
      </Card>
      <Badge pill bg="primary" onClick={handleOpenDlg}>
        Change this
      </Badge>
      <div id='licensesPopup'>
        {openDlg}
      </div>
    </>

  )
}
