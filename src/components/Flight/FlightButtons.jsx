import React, { useState, useContext } from 'react'
import { Button, Row, Col } from 'react-bootstrap'
import { Navigate } from 'react-router-dom'
import { FlightContext } from '../../contexts/FlightContext'
import { DbFlightContext } from '../../contexts/DbFlightContext'

export default function FlightButtons({ props }) {
  const { discardIgc } = useContext(FlightContext)
  const { getPreviousFlight, getNextFlight } = useContext(DbFlightContext)
  const [goBack, setGoBack] = useState()


  function handleGoBack() {
    setGoBack(<Navigate to="/" />)
  }

  function handleGoBook() {
    setGoBack(<Navigate to="/book" />)
  }

  function handleClearData() {
    props.clearCurrentData()
    discardIgc()
    props.setImage('assets/igc_nofile.png')
  }

  function handleDelete() {
    props.handleDelete()
  }

  function handleGetPrevious() {
    getPreviousFlight()
  }
  function handleGetNext() {
    getNextFlight()
  }

  function renderButtons() {
    if (props.newFlight) {
      return (
        <>
          {goBack}
          <Row className='pt-2'>
            <Col sm>
              <Button variant='primary' size='lg' style={{ width: '100%' }} onClick={props.handleSaveFlight} disabled={props.disabledSave}>Save Flight</Button>
            </Col>
            <Col sm>
              <Button variant='secondary' size='lg' style={{ width: '100%' }} onClick={handleGoBack}>Home</Button>
            </Col>
            <Col sm>
              <Button variant='danger' size='lg' style={{ width: '100%' }} onClick={handleClearData}>Clear</Button>
            </Col>
          </Row>
        </>
      )
    } else {
      return (
        <>
          {goBack}
          <Col sm className='text-center' style={{ alignSelf: 'center' }}>
            <Row className='pt-2'>
              <Col sm>
                <Button variant='secondary' size='lg' style={{ width: '100%' }} onClick={handleGetPrevious}>Prev</Button>
              </Col>
              <Col sm>
                <Button variant='primary' size='lg' style={{ width: '100%' }} onClick={props.handleUpdateFlight}>Update Flight</Button>
              </Col>
              <Col sm>
                <Button variant='info' size='lg' style={{ width: '100%' }} onClick={handleGoBook}>Flight Book</Button>
              </Col>
              <Col sm>
                <Button variant='danger' size='lg' style={{ width: '100%' }} onClick={handleDelete}>Delete Flight</Button>
              </Col>
              <Col sm>
                <Button variant='secondary' size='lg' style={{ width: '100%' }} onClick={handleGetNext}>Next</Button>
              </Col>
            </Row>
          </Col>
        </>
      )
    }
  }

  return (
    <>
      {renderButtons()}
    </>

  )
}
