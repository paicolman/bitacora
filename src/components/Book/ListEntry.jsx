import React, { useState, useContext } from 'react'
import { Card, Button, Row, Col, Image } from 'react-bootstrap'
import { Navigate } from 'react-router-dom'
import { DbFlightContext } from '../../contexts/DbFlightContext'
import FlightContainer from '../Flight/FlightContainer'

export default function ListEntry({ props }) {
  const { setActiveFlight } = useContext(DbFlightContext)
  // const [showBookOrDetails, setShowBookOrDetails] = useState()

  function hasIgc() {
    return props.flight.flightData.hasIgc ? 'assets/has_igc.png' : 'assets/no_igc.png'
  }

  function handleGetDetails() {
    setActiveFlight(props.flight)
    //setShowBookOrDetails(<Navigate to='/dbflight' />)
    props.showDetails()
  }

  return (
    <>
      <Card className='mt-3'>
        <Card.Header>
          <Card.Title style={{ float: 'left' }}><h4>{props.flight.flightData.flightDate}</h4></Card.Title>
          <Button variant='primary' style={{ float: 'right' }} size='sm' onClick={handleGetDetails} >Details</Button>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col sm={10}>
              <Row>
                <Col className='gradient'><b>Started:</b> {props.flight.flightData.launchTime}</Col>
                <Col className='gradient'><b>Landed:</b> {props.flight.flightData.landingTime}</Col>
                <Col className='gradient'><b>Duration:</b> {props.flight.flightData.duration}</Col>
              </Row>
              <Row className='pt-1'>
                <Col className='gradient'><b>Launch:</b> {props.flight.flightData.launchName}</Col>
                <Col className='gradient'><b>Landing:</b> {props.flight.flightData.landingName}</Col>
                <Col className='gradient'><b>Max Height:</b> {props.flight.flightData.maxHeight}m</Col>
              </Row>
            </Col>
            <Col sm={2}>
              <Image style={{ float: 'right' }} src={hasIgc()} />
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  )

}
