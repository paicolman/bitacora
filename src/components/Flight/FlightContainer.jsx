import React, { useEffect, useContext, useRef, useState } from 'react'
import { Form, Col, Container, Row, Card, FloatingLabel } from 'react-bootstrap'
import DropzoneFlight from './DropzoneFlight'
import FlightMap from './FlightMap'
import { Button } from 'react-bootstrap'
import { FlightContext } from '../../contexts/FlightContext'
import SelectGliders from './SelectGliders'
import PilotInfo from './PilotInfo'
import ShowLaunchOrLanding from './ShowLaunchOrLanding'
import MaxHeight from './MaxHeight'
import FlightDate from './FlightDate'
import AppHeader from '../AppHeader'


export default function FlightContainer() {
  const { eventBus, flightSpecs, saveFlightData } = useContext(FlightContext)
  const launchTime = useRef()
  const launchHeight = useRef()
  const landingTime = useRef()
  const maxSpeedRef = useRef()
  const maxClimbRef = useRef()
  const maxSinkRef = useRef()
  const maxDistanceRef = useRef()
  const pathLengthRef = useRef()
  const startLandingDistRef = useRef()
  const flightTypeRef = useRef()
  const flightCommentsRef = useRef()
  const [duration, setDuration] = useState('00:00:00')
  const [flightDate, setFlightDate] = useState('yyyy-mm-dd')
  const [maxHeight, setMaxHeight] = useState(0)
  const [launch, setLaunch] = useState(null)
  const [landing, setLanding] = useState(null)


  useEffect(() => {
    eventBus.on('igcParsed', (igc) => {
      launchTime.current.value = flightSpecs.launch.time
      launchHeight.current.value = flightSpecs.launch.pressureAltitude
      landingTime.current.value = flightSpecs.landing.time
      maxSpeedRef.current.value = flightSpecs.maxSpeed.toFixed(2)
      maxClimbRef.current.value = flightSpecs.maxClimb.toFixed(2)
      maxSinkRef.current.value = flightSpecs.maxSink.toFixed(2)
      maxDistanceRef.current.value = flightSpecs.maxDist.toFixed(2)
      pathLengthRef.current.value = flightSpecs.pathLength.toFixed(2)
      startLandingDistRef.current.value = flightSpecs.launchLandingDist.toFixed(2)
      setDuration(calculateDuration(flightSpecs.launch.time, flightSpecs.landing.time))
      setFlightDate(igc.date)
      console.log(flightSpecs.maxHeight)
      setMaxHeight(flightSpecs.maxHeight)
      setLaunch(flightSpecs.launch)
      setLanding(flightSpecs.landing)
      flightTypeRef.current.value = flightSpecs.flightType
    })
  })

  function calculateDuration(startTime, endTime) {
    if (startTime) {
      const launchPartsinSec = startTime.split(':').reduce((acc, time) => (60 * acc) + +time)
      const landPartsInSec = endTime.split(':').reduce((acc, time) => (60 * acc) + +time)
      const durationDate = new Date((landPartsInSec - launchPartsinSec) * 1000).toISOString().slice(11, 19)
      return durationDate
    } else {
      return ('00:00:00')
    }
  }

  function handleSaveFlight() {
    const dataToSave = {
      launchTime: launchTime.current.value,
      landingTime: landingTime.current.value,
      duration: duration,
      launchHeight: parseInt(launchHeight.current.value),
      flightType: flightTypeRef.current.value,
      maxSpeed: parseFloat(maxSpeedRef.current.value),
      maxClimb: parseFloat(maxClimbRef.current.value),
      maxSink: parseFloat(maxSinkRef.current.value),
      maxDist: parseFloat(maxDistanceRef.current.value),
      launchlandDist: parseFloat(startLandingDistRef.current.value),
      pathLength: parseFloat(pathLengthRef.current.value),
      comments: flightCommentsRef.current.value
    }

    saveFlightData(dataToSave)
  }

  function handleGoBack() {
    window.location = '/'
  }

  return (
    <>
      <AppHeader logoutUser={true} />
      <Container>
        <Row>
          <Col sm className='text-center'>
            <PilotInfo />
          </Col>
        </Row>
        <Row className='flight-title'>
          <Col sm className='text-center'>
            <FlightDate flightDate={flightDate} />
          </Col>
          <Col sm className='text-center'>
            <h2>Duration: {duration}</h2>
          </Col>
          <Col sm className='text-center'>
            <MaxHeight maxHeight={maxHeight} />
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
            <Row className='pt-2'>
              <Button variant='primary' size='lg' onClick={handleSaveFlight}>Save Flight</Button>
            </Row>
            <Row className='pt-2'>
              <Button variant='secondary' size='lg' onClick={handleGoBack}>Back</Button>
            </Row>
          </Col>
        </Row>

        <Row>
          <Col sm>
            <SelectGliders />
          </Col>
          <Col sm>
            <Row className='p-2'>
              <Col>
                <ShowLaunchOrLanding site={{ type: 'Launch:', point: launch }} />
              </Col>
            </Row>
            <Row className='p-2'>
              <Col>
                <ShowLaunchOrLanding site={{ type: 'Landing:', point: landing }} />

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
              <Form.Select id='flightType' ref={flightTypeRef}>
                <option value='top-down' >Top-down flight</option>
                <option value='thermal' >Soaring / thermal flight</option>
                <option value='x-country' >Cross-country</option>
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
              <Form.Control id='maxDist' type='number' placeholder='Max dist. from start' ref={maxDistanceRef} />
            </FloatingLabel>
          </Col>
          <Col sm>
            <FloatingLabel label='Dist Launch Landing (km):'>
              <Form.Control id='path' type='text' placeholder='Dist Launch Landing' ref={startLandingDistRef} />
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
              <Form.Control as="textarea" rows={6} placeholder='Flight Comments' ref={flightCommentsRef} />
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
