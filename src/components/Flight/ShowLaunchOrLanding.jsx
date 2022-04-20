import React, { useRef, useContext, useEffect } from 'react'
import { Form, FloatingLabel } from 'react-bootstrap'
import { FlightContext } from '../../contexts/FlightContext'

export default function ShowLaunchOrLanding({ site }) {
  const { getStartOrLanding, setLaunchOrLandingName } = useContext(FlightContext)
  const lauchLandingSite = useRef()

  useEffect(() => {
    if (site.point) { //Do search only if there is a valid IGC point
      getStartOrLanding(site, setName)
    }
  }, [site])

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
