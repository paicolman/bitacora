import React, { useEffect, useContext, useRef, useState } from 'react'
import { Container, Form, Row, Col } from 'react-bootstrap'
import ListEntry from './ListEntry'
import AppHeader from '../AppHeader'
import { DbFlightContext } from '../../contexts/DbFlightContext'
import FlightContainer from '../Flight/FlightContainer'

export default function FlightList() {
  const { getAllFlights, sortFlights, flights } = useContext(DbFlightContext)
  const [showListOrDetails, setShowListOrDetail] = useState()
  const inverted = useRef()

  useEffect(() => {
    getAllFlights()
  }, [])

  useEffect(() => {
    setShowListOrDetail(showListOfFlights())
  }, [flights])

  function handleSelect(e) {
    sortFlights(e.target.value, !inverted.current.value)
  }

  function handleInverted(e) {
    inverted.current.value = e.target.checked
    sortFlights(e.target, !inverted.current.value)
  }

  const listFlights = () => {
    if (flights) {
      const flightList = []
      for (const flight in flights) {
        const props = {
          flight: flights[flight],
          showDetails: showDetails
        }
        flightList.push(<ListEntry key={flight} props={props} />)
      }
      return (
        <>
          {flightList}
        </>
      )
    } else {
      return null
    }
  }

  function showDetails() {
    setShowListOrDetail(<FlightContainer newFlight={false} showList={showList} />)
  }

  function showList() {
    setShowListOrDetail(showListOfFlights())
  }

  function showListOfFlights() {
    return (
      <Container>
        <AppHeader props={{ home: true, logoutUser: true }} />
        <Row style={{ alignItems: 'center' }}>
          <Col sm={2}>
            <Form.Label htmlFor='sort' size='lg' className='mt-2 pb-2' ><h5>Sort Flights by:</h5></Form.Label>
          </Col>
          <Col sm={7}>
            <Form.Select id='sort' size='lg' className='mt-2 pb-2' onChange={handleSelect}>
              <option value='date'>Flight Date</option>
              <option value='duration'>Flight Duration</option>
              <option value='height'>Maximal Height</option>
              <option value='launch'>Launch</option>
              <option value='landing'>Landing</option>
            </Form.Select>
          </Col>
          <Col sm={3}>
            <h5><Form.Check className='m-3 float-right' type="switch" label='Inverted' ref={inverted} onChange={handleInverted} /></h5>
          </Col>
        </Row>
        {listFlights()}
      </Container>
    )
  }

  return (
    <>
      {showListOrDetails}
    </>
  )
}
