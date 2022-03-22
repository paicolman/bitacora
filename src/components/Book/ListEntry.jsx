import React, { useContext } from 'react'
import { Card, Button, Row, Col, Image } from 'react-bootstrap'

export default function ListEntry({ flight }) {

  function hasIgc() {
    return flight.hasIgc ? 'assets/has_igc.png' : 'assets/no_igc.png'
  }

  return (
    <Card className='mt-3'>
      <Card.Header>
        <Card.Title style={{ float: 'left' }}><h4>{flight.flightDate}</h4></Card.Title>
        <Button variant="primary" style={{ float: 'right' }} size='sm'>Details</Button>
      </Card.Header>
      <Card.Body>
        <Card.Text>
          <Row>
            <Col sm={10}>
              <Row>
                <Col className='gradient'><b>Started:</b> {flight.launchTime}</Col>
                <Col className='gradient'><b>Landed:</b> {flight.landingTime}</Col>
                <Col className='gradient'><b>Duration:</b> {flight.duration}</Col>
              </Row>
              <Row className='pt-1'>
                <Col className='gradient'><b>Launch:</b> {flight.launchName}</Col>
                <Col className='gradient'><b>Landing:</b> {flight.landingName}</Col>
                <Col className='gradient'><b>Max Height:</b> {flight.maxHeight}m</Col>
              </Row>
            </Col>
            <Col sm={2}>
              <Image style={{ float: 'right' }} src={hasIgc()} />
            </Col>
          </Row>

        </Card.Text>

      </Card.Body>
    </Card>
  )
}
