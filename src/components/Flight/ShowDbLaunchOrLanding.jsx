import React, { useRef, useContext, useEffect } from 'react'
import { Form, FloatingLabel } from 'react-bootstrap'
import { FlightContext } from '../../contexts/FlightContext'

export default function ShowDbLaunchOrLanding({ site }) {
  const { setLaunchOrLandingName } = useContext(FlightContext)
  const lauchLandingSite = useRef()

  useEffect(() => {
    lauchLandingSite.current.value = site.name
  })

  function handleChange() {
    setLaunchOrLandingName({ type: site.type, name: lauchLandingSite.current.value })
  }

  return (
    <FloatingLabel label={site.type}>
      <Form.Control id='start' type='text' placeholder='Launch' ref={lauchLandingSite} onChange={handleChange} />
    </FloatingLabel>
  )
}
