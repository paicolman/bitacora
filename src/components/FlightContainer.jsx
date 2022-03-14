import React, { useEffect, useContext, useRef, useState } from 'react'
import { Form, Col, Container, Row, Card, FloatingLabel } from 'react-bootstrap'
import DropzoneFlight from './DropzoneFlight'
import FlightMap from './FlightMap'
import { Button } from 'react-bootstrap'
import { FlightContext } from '../contexts/FlightContext'
import SelectGliders from './SelectGliders'
import PilotInfo from './PilotInfo'


export default function FlightContainer() {
  const { eventBus, flightSpecs } = useContext(FlightContext)

  const flightDataModel = {
    launchTime: 0,
    landingTime: 0,
    launchHeight: 0,
    flightType: 0,
    maxSpeed: 0,
    minSpeed: 0,
    maxClimb: 0,
    maxSink: 0,
    maxDist: 0,
    pathLength: 0,
    launchLandingDist: 0,
    duration: 'Duration: --:--:--',
    flightDate: 'Date: ....-..-..',
    maxHeigth: 'Max Height: ----m'
  }

  const launchTime = useRef()
  const launchHeight = useRef()
  const landingTime = useRef()
  const maxSpeedRef = useRef()
  const maxClimbRef = useRef()
  const maxSinkRef = useRef()
  const maxDistanceRef = useRef()
  const pathLengthRef = useRef()
  const startLandingDistRef = useRef()
  //const [duration, setDuration] = useState('Duration: --:--:--')
  //const [flightDate, setFlightDate] = useState('Date: ....-..-..')
  //const [maxHeigth, setMaxHeigth] = useState('Max Height: ----m')
  const [flightData, setFlightData] = useState(flightDataModel)

  useEffect(() => {
    console.log('ON PARSED (FlightCont.)')
    eventBus.on('igcParsed', (igc) => {
      setFlightData(flightSpecs => {
        // const landing = (findLandingPoint(igc))
        launchTime.current.value = flightData?.launch?.time
        launchHeight.current.value = flightData?.launch?.pressureAltitude
        landingTime.current.value = flightData?.landing?.time
        const duration = calculateDuration(flightData?.launch?.time, flightData?.landing?.time)
        // setFlightDate(`Date: ${igc.date}`)
        // setMaxHeigth(`Max Height: ${getMaxHeight()} m`)
        maxSpeedRef.current.value = flightData?.maxSpeed
        maxClimbRef.current.value = flightData?.maxClimb
        maxSinkRef.current.value = flightData?.maxSink
        maxDistanceRef.current.value = flightData?.maxDist
        pathLengthRef.current.value = flightData?.pathLength
        startLandingDistRef.current.value = flightData?.launchLandingDist
      })
    })
  })

  function calculateDuration(startTime, endTime) {
    if (startTime) {
      const launchPartsinSec = startTime.split(':').reduce((acc, time) => (60 * acc) + +time)
      const landPartsInSec = endTime.split(':').reduce((acc, time) => (60 * acc) + +time)
      const durationDate = new Date((landPartsInSec - launchPartsinSec) * 1000).toISOString().slice(11, 19)
      return (`Duration: ${durationDate}`)
    } else {
      return ('Duration: --:--:--')
    }
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
            <h2>{flightData.flightDate}</h2>
          </Col>
          <Col sm>
            <h2>{flightData.duration}</h2>
          </Col>
          <Col sm>
            <h2>{flightData.maxHeigth}</h2>
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
            <FloatingLabel label='Start Height (m):'>
              <Form.Control id='st-height' type='number' placeholder='Start Height' ref={launchHeight} />
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
          <Col>
            <FloatingLabel label='Max Speed (kmh):'>
              <Form.Control id='speed' type='text' placeholder='Max. Speed' ref={maxSpeedRef} />
            </FloatingLabel>
          </Col>
          <Col>
            <FloatingLabel label='Max Speed (kmh):'>
              <Form.Control id='speed' type='text' placeholder='Max. Speed' ref={maxSpeedRef} />
            </FloatingLabel>
          </Col>
          <Col>
            <FloatingLabel label='Max Climb (m/s):'>
              <Form.Control id='climb' type='text' placeholder='Max Climb' ref={maxClimbRef} />
            </FloatingLabel>
          </Col>
          <Col>
            <FloatingLabel label='Max Sink (m/s):'>
              <Form.Control id='sink' type='text' placeholder='Max Sink' ref={maxSinkRef} />
            </FloatingLabel>
          </Col>
        </Row>
        <Row className='pt-2' >
          <Col sm>
            <FloatingLabel label='Max dist. from start (km):'>
              <Form.Control id='maxDist' type='number' ref={maxDistanceRef} />
            </FloatingLabel>
          </Col>
          <Col sm>
            <FloatingLabel label='Dist Launch-Landing (km):'>
              <Form.Control id='path' type='text' placeholder='Dist Launch-Landing' ref={startLandingDistRef} />
            </FloatingLabel>
          </Col>
          <Col sm>
            <FloatingLabel label='Path Length (km):'>
              <Form.Control id='path' type='text' placeholder='Path Length' ref={pathLengthRef} />
            </FloatingLabel>
          </Col>
        </Row>
        <Row className='pt-2'>
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
