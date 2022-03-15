import React, { useState, useContext } from 'react'
import { ProfileDataContext } from '../../contexts/ProfileDataContext'
import { Badge, Card, Col, Row } from 'react-bootstrap'
import EditGliders from './EditGliders'
import ShowGliderDetails from './ShowGliderDetails'
import DropzoneGlider from './DropzoneGlider'


export default function ShowGliders() {
  const { getProfileData, updateProfileData } = useContext(ProfileDataContext)
  const [dataReady, setDataReady] = useState(false)
  const [gliders, setgliders] = useState(null)
  const [openDlg, setOpenDlg] = useState(null)
  const [openDetailsDlg, setOpenDetailsDlg] = useState(null)





  async function getDataFromDb() {
    if (!dataReady) {

      const data = await getProfileData('/profile/gliders')
      console.log(data)
      setgliders(data)
      setDataReady(true)
    }
  }

  if (!dataReady) {
    getDataFromDb()
  }

  function handleShowDetails(e) {
    console.log('show details')
    e.preventDefault()
    const index = parseInt(e.target.id.split('-')[1])
    const props = {
      glider: gliders[index],
      onClose: onDetailsClose
    }
    console.log(props)
    setOpenDetailsDlg(<ShowGliderDetails props={props} />)
  }

  function onDetailsClose() {
    console.log('Resetting stuff')
    setOpenDetailsDlg(null)
  }

  function glidersList() {
    let retVal = <Col sm>please wait...</Col>
    if (dataReady && gliders) {
      retVal = gliders.map((glider, idx) => {
        return (
          <Row key={`gliders-${idx}`} style={{ maxHeight: '200px' }}>
            <Col id={`gliders-${idx}`} sm className='text-center rounded-box pt-3 m-1 glider-list' onClick={handleShowDetails}>
              <Row className='justify-content-center'><h5 id={`type-${idx}`}>{glider.type}</h5></Row>
              <Row><b id={`manu-${idx}`}>{glider.manufacturer}</b></Row>
              <Row><b id={`modl-${idx}`}>{glider.model}</b></Row>
              <Row><b id={`nick-${idx}`}>{glider.nickname}</b></Row>
            </Col>
            <Col sm className='w-50' style={{ alignSelf: 'center' }}>
              <DropzoneGlider gliderId={glider.id} style={{ maxHeight: '200px' }} />
            </Col>
          </Row>
        )
      })
    }
    return retVal
  }

  function handleOpenDlg() {
    const props = {
      gliders: gliders,
      onClose: onClose
    }
    setOpenDlg(<EditGliders props={props} />)
  }

  function onClose(dialogData) {
    console.log(dialogData)
    if (dialogData) {
      updateProfileData('/profile/gliders', dialogData.gliders, () => {
        setDataReady(false)
      })
    }
    setOpenDlg(null)
  }

  return (
    <>
      <Card className='text-center'>
        <Card.Header><h3>Your Wings</h3></Card.Header>
        <Card.Title>Here are your flying machines!</Card.Title>
        <Card.Body>
          {glidersList()}
          <Badge className='mt-2' pill bg="primary" onClick={handleOpenDlg}>
            Change this
          </Badge>
        </Card.Body>
      </Card>
      <div id='GlidersPopup'>
        {openDlg}
      </div>
      <div id='GliderDetailsPopup'>
        {openDetailsDlg}
      </div>
    </>
  )
}
