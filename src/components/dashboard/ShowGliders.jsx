import React, { useState, useContext } from 'react'
import { ProfileDataContext } from '../../contexts/ProfileDataContext'
import { Badge, Card, Col, Row } from 'react-bootstrap'
import EditGliders from './EditGliders'

export default function ShowGliders() {
  const { getMainOrLicenceData, updateMainOrLicenceData } = useContext(ProfileDataContext)
  const [dataReady, setDataReady] = useState(false)
  const [gliders, setgliders] = useState(null)
  const [openDlg, setOpenDlg] = useState(null)

  async function getDataFromDb() {
    if (!dataReady) {

      const data = await getMainOrLicenceData('/profile/gliders')
      console.log(data)
      setgliders(data)
      setDataReady(true)
    }
  }

  if (!dataReady) {
    getDataFromDb()
  }

  function glidersList() {
    let retVal = <Col sm>please wait...</Col>
    if (dataReady) {
      retVal = gliders.map((glider, idx) => {
        return (
          <Row key={`gliders-${idx}`}>
            <Col sm className='text-center rounded-box pt-3 m-3'>
              <Row><Col sm><h4>{glider.type}</h4></Col></Row>
              <Row><Col sm><h5>{glider.manufacturer}</h5></Col></Row>
              <Row><Col sm><h5>{glider.model}</h5></Col></Row>
            </Col>
            <Col sm>
              <img alt='Pic of a HG' className='img-fluid rounded shadow-2-strong pt-2' src='https://upload.wikimedia.org/wikipedia/commons/d/d1/Hang_gliding_hyner.jpg' />
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
    // console.log(dialogData)
    // if (dialogData) {
    //   updateMainOrLicenceData('/profile/gliders', dialogData.licenses, () => {
    //     setDataReady(false)
    //   })
    // }
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
    </>
  )
}
