import React, { useRef, useContext } from 'react'
import { Form, FloatingLabel } from 'react-bootstrap'
import { getDistance } from 'geolib'
import { FlightContext } from '../../contexts/FlightContext'

export default function ShowLaunchOrLanding({ site }) {
  const { getStartPlace, setLaunchOrLandingName } = useContext(FlightContext)
  const lauchLandingSite = useRef()

  getStartPlace(site, setName)

  function setName(startOrLanding) {
    if (startOrLanding) {
      lauchLandingSite.current.value = startOrLanding.name
    }
  }

  function handleChange() {
    setLaunchOrLandingName({ type: site.type, name: lauchLandingSite.current.value })
  }

  return (
    <FloatingLabel label={site.type}>
      <Form.Control id='start' type='text' placeholder='Launch' ref={lauchLandingSite} onChange={handleChange} />
    </FloatingLabel>
  )
}
