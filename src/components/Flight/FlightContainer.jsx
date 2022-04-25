import React, { useEffect, useContext, useRef, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Form, Col, Container, Row, Card, FloatingLabel, Image, Badge, Accordion } from 'react-bootstrap'
import DropzoneFlight from './DropzoneFlight'
import FlightMap from './FlightMap'
import { FlightContext } from '../../contexts/FlightContext'
import { DbFlightContext } from '../../contexts/DbFlightContext'
import SelectGliders from './SelectGliders'
import PilotInfo from './PilotInfo'
import ShowLaunchOrLanding from './ShowLaunchOrLanding'
import MaxHeight from './MaxHeight'
import FlightDate from './FlightDate'
import AppHeader from '../AppHeader'
import ConfirmToast from './ConfirmToast'
import FlightButtons from './FlightButtons'
import ShowDbLaunchOrLanding from './ShowDbLaunchOrLanding'
import ConfirmationDialog from './ConfirmationDialog'

export default function FlightContainer({ newFlight, showList }) {
  const { activeFlight, deleteFlight, getNextFlight, getFirstFlight, downloadIGC } = useContext(DbFlightContext)
  const { eventBus, flightSpecs, setLaunchOrLandingName, saveFlightData, getExistingFlightId, loadIgcFromDB } = useContext(FlightContext)
  const { dbEventBus } = useContext(DbFlightContext)
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
  const hasIgc = useRef(false)
  const isMounted = useRef(false)
  const [duration, setDuration] = useState('00:00:00')
  const [flightDate, setFlightDate] = useState('yyyy-MM-dd')
  const [maxHeight, setMaxHeight] = useState(0)
  const [launch, setLaunch] = useState(null)
  const [landing, setLanding] = useState(null)
  const [confirmToast, setConfirmToast] = useState(null)
  const [image, setImage] = useState('assets/igc_nofile.png')
  const [disabledSave, setDisabledSave] = useState(true)
  const [showConfirmDlg, setShowConfirmDlg] = useState()

  useEffect(() => {
    eventBus.on('igcParsed', (igc) => {
      hasIgc.current = true
      if (newFlight) {
        setImage('assets/has_igc.png')
        clearCurrentData()
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
        setMaxHeight(flightSpecs.maxHeight)
        setLaunch(flightSpecs.launch)
        setLanding(flightSpecs.landing)
        flightTypeRef.current.value = flightSpecs.flightType
      }
    })
    eventBus.on('newDate', (dateInfo) => {
      saveDisabled(dateInfo)
    })
    if (!newFlight && activeFlight) {
      launchTime.current.value = activeFlight.flightData.launchTime
      launchHeight.current.value = activeFlight.flightData.launchHeight
      landingTime.current.value = activeFlight.flightData.landingTime
      maxSpeedRef.current.value = activeFlight.flightData.maxSpeed.toFixed(2)
      maxClimbRef.current.value = activeFlight.flightData.maxClimb.toFixed(2)
      maxSinkRef.current.value = activeFlight.flightData.maxSink.toFixed(2)
      maxDistanceRef.current.value = activeFlight.flightData.maxDist.toFixed(2)
      pathLengthRef.current.value = activeFlight.flightData.pathLength.toFixed(2)
      startLandingDistRef.current.value = activeFlight.flightData.launchLandingDist.toFixed(2)
      flightTypeRef.current.value = activeFlight.flightData.flightType
      flightCommentsRef.current.value = activeFlight.flightData.comments
      setFlightDate(activeFlight.flightData.flightDate)
      setDuration(activeFlight.flightData.duration)
      setMaxHeight(activeFlight.flightData.maxHeight)
      setLaunchOrLandingName({ type: 'Launch:', name: activeFlight.flightData.launchName })
      setLaunchOrLandingName({ type: 'Landing:', name: activeFlight.flightData.landingName })
      if (activeFlight.flightData.hasIgc) {
        loadIgcFromDB(activeFlight.flightId)
      }
    }
    dbEventBus.on('switchActiveFlight', (switchedFlight) => {
      if (isMounted.current) {
        launchTime.current.value = switchedFlight.flightData.launchTime
        launchHeight.current.value = switchedFlight.flightData.launchHeight
        landingTime.current.value = switchedFlight.flightData.landingTime
        maxSpeedRef.current.value = switchedFlight.flightData.maxSpeed.toFixed(2)
        maxClimbRef.current.value = switchedFlight.flightData.maxClimb.toFixed(2)
        maxSinkRef.current.value = switchedFlight.flightData.maxSink.toFixed(2)
        maxDistanceRef.current.value = switchedFlight.flightData.maxDist.toFixed(2)
        pathLengthRef.current.value = switchedFlight.flightData.pathLength.toFixed(2)
        startLandingDistRef.current.value = switchedFlight.flightData.launchLandingDist.toFixed(2)
        flightTypeRef.current.value = switchedFlight.flightData.flightType
        flightCommentsRef.current.value = switchedFlight.flightData.comments
        setFlightDate(switchedFlight.flightData.flightDate)
        setDuration(switchedFlight.flightData.duration)
        setMaxHeight(switchedFlight.flightData.maxHeight)
        setLaunchOrLandingName({ type: 'Launch:', name: switchedFlight.flightData.launchName })
        setLaunchOrLandingName({ type: 'Landing:', name: switchedFlight.flightData.landingName })
        if (switchedFlight.flightData.hasIgc) {
          loadIgcFromDB(switchedFlight.flightId)
        }
      }
    })
    isMounted.current = true

    return (() => {
      isMounted.current = false
      eventBus.remove('igcParsed', () => { console.log('removed listener for igcParsed') })
      eventBus.remove('newDate', () => { console.log('removed listener for newDate') })
      dbEventBus.remove('switchActiveFlight', () => { console.log('removed listener for switchActiveFlight') })
    })
  }, [])

  function saveDisabled() {
    const dateNotReady = isNaN(Date.parse(flightSpecs.flightDate))
    const launch = launchTime?.current?.value === ''
    const landing = landingTime?.current?.value === ''

    setDisabledSave(dateNotReady || launch || landing)
  }

  function clearCurrentData() {
    launchTime.current.value = null
    launchHeight.current.value = null
    landingTime.current.value = null
    maxSpeedRef.current.value = null
    maxClimbRef.current.value = null
    maxSinkRef.current.value = null
    maxDistanceRef.current.value = null
    pathLengthRef.current.value = null
    startLandingDistRef.current.value = null
    flightTypeRef.current.value = null
    setDuration(null)
    setFlightDate(null)
    setMaxHeight(0)
    setLaunch('')
    setLanding('')
  }

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

  function calculateDurationManually() {
    if (launchTime.current.value && landingTime.current.value) {
      setDuration(calculateDuration(launchTime.current.value, landingTime.current.value))
    }
    saveDisabled(flightDate)
  }

  function showMessage(response) {
    let confirm = <></>
    switch (response.split('.')[0]) {
      case 'UPLOADED':
        confirm = <ConfirmToast props={{ type: 'success', header: 'SUCCESS!', message: 'Flight has been saved', explanation: 'This flight is now available in you log book', closeToast: closeToast }} />
        break
      case 'DUPLICATE':
        confirm = <ConfirmToast props={{ type: 'warning', header: 'WARNING!', message: 'This Flight already exists!', explanation: 'There is already a flight with the same date and starting time', closeToast: closeToast }} />
        break
      default:
        confirm = <ConfirmToast props={{ type: 'error', header: 'ERROR!', message: 'An unexpected error ocurred!', explanation: `The database responded with the following error: ${response}`, closeToast: closeToast }} />
        break
    }
    setConfirmToast(confirm)
  }

  function closeToast() {
    setConfirmToast(null)
  }

  function showIgc() {
    if (activeFlight?.flightData?.hasIgc) {
      return (
        <>
          <Row className='igc-container'>
            <Image className='igc-image pb-1' src='assets/has_igc.png' />
          </Row>
          <Row>
            <Badge pill bg='primary' onClick={downloadIGC}>Download</Badge>
          </Row>
        </>
      )
    } else {
      return (
        <>
          <Row className='igc-container'>
            <Image className='igc-image pb-1' src='assets/no_igc.png' />
          </Row>
          <Row>
            <Badge pill bg='primary' >Add IGC</Badge>
          </Row>
        </>
      )
    }
  }

  function showDropzoneOrIgcIcon() {
    if (newFlight) {
      return (
        <>
          <Col sm={7} className='text-center'>
            <PilotInfo />
          </Col>
          <Col sm={5}>
            <DropzoneFlight image={image} />
          </Col>
        </>
      )
    } else {
      return (
        <>
          <Row className='pt-2 pb-2'>
            <Col sm={10} className='text-center'>
              <PilotInfo />
            </Col>
            <Col sm={2}>
              {showIgc()}
            </Col>
          </Row>

        </>
      )
    }
  }

  async function handleSaveFlight() {
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
    let existingId = null
    if (!newFlight) {
      flightSpecs.flightDate = activeFlight.flightData.flightDate
      existingId = activeFlight.flightId
    } else {
      existingId = await getExistingFlightId()
    }
    if (existingId) {
      const props = {
        show: true,
        title: `Update existing flight from ${flightSpecs.flightDate}`,
        text: `Are you sure you want to update the flight from ${flightSpecs.flightDate} with the actual data?`,
        action: 'Update this flight',
        dataToSave: dataToSave,
        flightId: existingId,
        confirm: updateFlight
      }
      setShowConfirmDlg(<ConfirmationDialog props={props} />)
    } else {
      const response = await saveFlightData(dataToSave, null)
      showMessage(response)
    }
  }

  async function updateFlight(dataToSave, existingFlightId) {
    setShowConfirmDlg(null)
    if (dataToSave) {
      const response = await saveFlightData(dataToSave, existingFlightId)
      showMessage(response)
    }

  }

  function handleDelete() {
    const props = {
      show: true,
      title: `Delete Flight from ${activeFlight.flightData.flightDate}`,
      text: `Are you sure you want to delete the flight from ${activeFlight.flightData.flightDate}? This flight will be removed from your flight log!`,
      action: 'Delete this flight',
      confirm: deleteFlightFromDb
    }
    setShowConfirmDlg(<ConfirmationDialog props={props} />)
  }

  async function deleteFlightFromDb(confirm) {
    setShowConfirmDlg(null)
    if (confirm) {
      await deleteFlight()
      if (!getNextFlight()) {
        if (!getFirstFlight()) {
          setShowConfirmDlg(<Navigate to='/' />)
        }
      }
    }
  }

  function showLaunch() {
    return newFlight ? <ShowLaunchOrLanding site={{ type: 'Launch:', point: launch }} />
      : <ShowDbLaunchOrLanding site={{ type: 'Launch:', name: activeFlight?.flightData?.launchName }} />
  }

  function showLanding() {
    return newFlight ? <ShowLaunchOrLanding site={{ type: 'Landing:', point: landing }} />
      : <ShowDbLaunchOrLanding site={{ type: 'Landing:', name: activeFlight?.flightData?.landingName }} />
  }
  function gliderIdFromDB() {
    return newFlight ? '' : activeFlight?.flightData?.gliderId
  }

  const buttonProps = {
    handleSaveFlight,
    clearCurrentData,
    setImage,
    disabledSave,
    newFlight,
    handleDelete,
    showList
  }

  return (
    <>
      <Container>
        {showConfirmDlg}
        <AppHeader props={{ home: true, book: true, logoutUser: true }} />
        <Row>
          {showDropzoneOrIgcIcon()}
        </Row>
        <Row className='flight-title'>
          <Col sm className='text-center'>
            <FlightDate date={flightDate} />
          </Col>
          <Col sm className='text-center'>
            <h2>Duration: {duration}</h2>
          </Col>
          <Col sm className='text-center'>
            <MaxHeight maxHeight={maxHeight} />
          </Col>
        </Row>
        <Row className='p-3'>
          <FlightButtons props={buttonProps} />
        </Row>
        <Accordion>
          <Accordion.Item eventKey='1'>
            <Accordion.Header>Flight Data</Accordion.Header>
            <Accordion.Body>

              <Row>
                <Col sm>
                  <SelectGliders gliderIdFromDB={gliderIdFromDB()} />
                </Col>
                <Col sm>
                  <Row className='p-2'>
                    <Col>
                      {showLaunch()}
                    </Col>
                  </Row>
                  <Row className='p-2'>
                    <Col>
                      {showLanding()}
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className='pt-2'>
                <Col sm>
                  <FloatingLabel label='Launch Time:'>
                    <Form.Control id='launchtime' type='time' ref={launchTime} onChange={calculateDurationManually} />
                  </FloatingLabel>
                </Col>
                <Col sm>
                  <FloatingLabel label='Landing Time:'>
                    <Form.Control id='landingtime' type='time' ref={landingTime} onChange={calculateDurationManually} />
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
                    <Form.Control id='speed' type='number' placeholder='Max. Speed' ref={maxSpeedRef} />
                  </FloatingLabel>
                </Col>
                <Col>
                  <FloatingLabel label='Max Climb (m/s):'>
                    <Form.Control id='climb' type='number' placeholder='Max Climb' ref={maxClimbRef} />
                  </FloatingLabel>
                </Col>
                <Col>
                  <FloatingLabel label='Max Sink (m/s):'>
                    <Form.Control id='sink' type='number' placeholder='Max Sink' ref={maxSinkRef} />
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
                    <Form.Control id='path' type='number' placeholder='Dist Launch Landing' ref={startLandingDistRef} />
                  </FloatingLabel>
                </Col>
                <Col sm>
                  <FloatingLabel label='Path Length (km):'>
                    <Form.Control id='path' type='number' placeholder='Path Length' ref={pathLengthRef} />
                  </FloatingLabel>
                </Col>
              </Row>
              <Row className='pt-2'>
                <Col sm>
                  <FloatingLabel label='Flight Comments:'>
                    <Form.Control as='textarea' rows={6} placeholder='Flight Comments' ref={flightCommentsRef} />
                  </FloatingLabel>
                </Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        <Row className='pt-4'>
          <Col sm>
            <Card>
              <Card.Header>Flight Track</Card.Header>
              <Card.Body>
                <FlightMap />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      {confirmToast}
    </>
  )
}
