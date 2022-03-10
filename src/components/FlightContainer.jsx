import React, { useEffect, useContext, useRef, useState } from 'react'
import { Form, Col, Container, Row, Card, FloatingLabel } from 'react-bootstrap'
import DropzoneFlight from './DropzoneFlight'
import FlightMap from './FlightMap'
import { Button } from 'react-bootstrap'
import { FlightContext } from '../contexts/FlightContext'
import SelectGliders from './SelectGliders'
import PilotInfo from './PilotInfo'


export default function FlightContainer() {
  const { eventBus, findStartingPoint, findLandingPoint, getMaxHeight } = useContext(FlightContext)
  const launchTime = useRef()
  const launchHeight = useRef()
  const landingTime = useRef()
  const [duration, setDuration] = useState('Duration: --:--:--')
  const [flightDate, setFlightDate] = useState('Date: ....-..-..')
  const [maxHeigth, setMaxHeigth] = useState('Max Height: ----m')

  useEffect(() => {
    console.log('ON PARSED (FlightCont.)')
    eventBus.on('igcParsed', (igc) => {
      const launch = (findStartingPoint(igc))
      // const landing = (findLandingPoint(igc))
      launchTime.current.value = launch.time
      launchHeight.current.value = launch.pressureAltitude
      const landing = (findLandingPoint(igc))
      landingTime.current.value = landing.time
      calculateDuration(launch.time, landing.time)
      setFlightDate(`Date: ${igc.date}`)
      setMaxHeigth(`Max Height: ${getMaxHeight(igc)} m`)
    })
  }, [])

  function calculateDuration(startTime, endTime) {
    const launchPartsinSec = startTime.split(':').reduce((acc, time) => (60 * acc) + +time)
    const landPartsInSec = endTime.split(':').reduce((acc, time) => (60 * acc) + +time)
    const durationDate = new Date((landPartsInSec - launchPartsinSec) * 1000).toISOString().slice(11, 19)
    setDuration(`Duration: ${durationDate}`)

  }

  return (
    <>
      <Container>
        <Row>
          <Col sm className='text-center'>
            <PilotInfo />
          </Col>
        </Row>
        <Row className='flight-title'>
          <Col sm>
            <h2>{flightDate}</h2>
          </Col>
          <Col sm>
            <h2>{duration}</h2>
          </Col>
          <Col sm>
            <h2>{maxHeigth}</h2>
          </Col>
        </Row>
        <Row className='p-3'>
          <Col sm={4} style={{ alignSelf: 'center' }}>
            <p>If you have an IGC file, you can drop it on the left side, or click to select it. Bitacora will analyze the file and fill in all the possible fields in the form</p>
          </Col>
          <Col sm={4}>
            <DropzoneFlight />
          </Col>
          <Col sm={4} className='text-center' style={{ alignSelf: 'center' }}>
            <Button variant='primary' size='lg'>Save Flight</Button>
          </Col>
        </Row>

        <Row>
          <Col sm>
            <SelectGliders />
          </Col>
          <Col sm>
            <Row>
              <Col>
                <FloatingLabel label='Launch:'>
                  <Form.Control id='start' type='text' placeholder='Launch' />
                </FloatingLabel>
              </Col>
            </Row>
            <Row>
              <Col>
                <FloatingLabel className='pt-2 p-0' label='Landing:'>
                  <Form.Control id='landing' type='text' placeholder='Landing' />
                </FloatingLabel>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className='pt-2'>
          <Col sm>
            <FloatingLabel label='Launch Time:'>
              <Form.Control id='launchtime' type='time' ref={launchTime} />
            </FloatingLabel>
          </Col>
          <Col sm>
            <FloatingLabel label='Landing Time:'>
              <Form.Control id='landingtime' type='time' ref={landingTime} />
            </FloatingLabel>
          </Col>
          <Col sm>
            <FloatingLabel controlId='flightType' label='Flight type:'>
              <Form.Select id='flightType'>
                <option value='1'>Top-down flight</option>
                <option value='2'>Soaring / thermal flight</option>
                <option value='3'>Cross-country</option>
              </Form.Select>
            </FloatingLabel>
          </Col>
        </Row>
        <Row className='pt-2'>
          <Col sm>
            <FloatingLabel label='Start Height:'>
              <Form.Control id='st-height' type='number' placeholder='Start Height' ref={launchHeight} />
            </FloatingLabel>
          </Col>
          <Col>
            <FloatingLabel label='Max Speed:'>
              <Form.Control id='speed' type='text' placeholder='Max. Speed' />
            </FloatingLabel>
          </Col>
          <Col>
            <FloatingLabel label='Wind direction:'>
              <Form.Control id='wind' type='text' placeholder='Wind' />
            </FloatingLabel>
          </Col>
        </Row>
        <Row className='pt-2' >
          <Col sm>
            <FloatingLabel label='Flight Comments:'>
              <Form.Control as="textarea" rows={6} placeholder='Flight Comments' />
            </FloatingLabel>
          </Col>
        </Row>
        <Row className='pt-4'>
          <Col sm>
            <Card><Card.Header>Track</Card.Header>
              <Card.Body>
                <FlightMap />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
}
