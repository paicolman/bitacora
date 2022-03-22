import React, { useEffect, useContext, useState } from 'react'
import { Container, Form, Row, Col } from 'react-bootstrap'
import ListEntry from './ListEntry'
import AppHeader from '../AppHeader'
import { DbFlightContext } from '../../contexts/DbFlightContext'

export default function FlightList() {
  const { getAllFlights, sortFlights, flights } = useContext(DbFlightContext)

  useEffect(() => {
    getAllFlights()
  }, [])

  const listFlights = () => {
    if (flights) {
      const flightList = []
      for (const flight in flights) {
        flightList.push(< ListEntry key={flight} flight={flights[flight]} />)
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

  function handleSelect(e) {
    sortFlights(e.target.value)
  }

  return (
    <Container>
      <AppHeader props={{ home: true, logoutUser: true }} />
      <Row>
        <Col sm={2}>
          <Form.Label htmlFor='sort' size='lg' className='mt-2 pb-2' ><h5>Sort Flights by:</h5></Form.Label>
        </Col>
        <Col sm={10}>
          <Form.Select id='sort' size='lg' className='mt-2 pb-2' onChange={handleSelect}>
            <option value='date'>Flight Date</option>
            <option value='duration'>Flight Duration</option>
            <option value='height'>Maximal Height</option>
            <option value='launch'>Launch</option>
            <option value='landing'>Landing</option>
          </Form.Select>
        </Col>
      </Row>
      {listFlights()}
    </Container>
  )
}
