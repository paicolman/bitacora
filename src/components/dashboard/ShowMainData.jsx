import React, { useContext, useState } from 'react'
import { ProfileDataContext } from '../../contexts/ProfileDataContext'
import { Badge, Card } from 'react-bootstrap'
import EditMainData from './EditMainData'
import ShowLicenses from './ShowLicenses'

export default function ShowMainData({ props }) {

  const { getMainOrLicenceData, updateMainOrLicenceData } = useContext(ProfileDataContext)
  const [dataReady, setDataReady] = useState(false)
  const [mainData, setMainData] = useState(null)
  const [openDlg, setOpenDlg] = useState(null)

  async function getDataFromDb() {
    if (!dataReady) {
      setDataReady(true)
      const data = await getMainOrLicenceData('/profile/mainData')
      setMainData(data)
    }
  }

  if (!dataReady) {
    getDataFromDb()
  }

  function handleOpenDlg() {
    console.log('Rendering dialog')
    const props = {
      data: mainData,
      onClose: onClose
    }
    setOpenDlg(<EditMainData props={props} />)
  }

  function onClose(dialogData) {
    console.log(dialogData)
    if (dialogData) {
      updateMainOrLicenceData('/profile/mainData', dialogData, () => {
        setDataReady(false)
      })
    }
    setOpenDlg(null)
  }

  return (
    <>
      <Card className='profile-container text-center'>
        <Card.Header><h1>{mainData?.pilotName}</h1></Card.Header>
        <Card.Subtitle className='pt-2'>
          <h2>Flying since: {mainData?.flyingSince}</h2>
          <Badge pill bg="primary" onClick={handleOpenDlg}>
            Change this
          </Badge>
        </Card.Subtitle>
        <Card.Body className='text-center licenses-container'>
          <ShowLicenses />
        </Card.Body>
      </Card>
      <div id='mainDataPopup'>
        {openDlg}
      </div>
    </>
  )
}
