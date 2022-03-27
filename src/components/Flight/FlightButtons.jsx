import React, { useState, useContext } from 'react'
import { Button, Row, Col } from 'react-bootstrap'
import { Navigate } from 'react-router-dom'
import { FlightContext } from '../../contexts/FlightContext'

export default function FlightButtons({ props }) {
  const { discardIgc } = useContext(FlightContext)
  const [goBack, setGoBack] = useState()


  function handleGoBack() {
    setGoBack(<Navigate to="/" />)
  }

  function handleClearData() {
    props.clearCurrentData()
    discardIgc()
    props.setImage('assets/igc_nofile.png')
  }

  return (
    <>
      {goBack}
      <Col sm={4} className='text-center' style={{ alignSelf: 'center' }}>
        <Row className='pt-2'>
          <Button variant='primary' size='lg' onClick={props.handleSaveFlight} disabled={props.disabledSave}>Save Flight</Button>
        </Row>
        <Row className='pt-2'>
          <Col sm>
            <Button variant='secondary' size='lg' style={{ width: '100%' }} onClick={handleGoBack}>Back</Button>
          </Col>
          <Col sm>
            <Button variant='danger' size='lg' style={{ width: '100%' }} onClick={handleClearData}>Clear</Button>
          </Col>
        </Row>
      </Col>
    </>
  )
}
