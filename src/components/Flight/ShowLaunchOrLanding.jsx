import React, { useRef, useContext } from 'react'
import { Form, FloatingLabel } from 'react-bootstrap'
import { getDistance } from 'geolib'
import { FlightContext } from '../../contexts/FlightContext'

export default function ShowLaunchOrLanding({ site }) {
  const { setLaunchOrLandingName } = useContext(FlightContext)
  const lauchLandingSite = useRef()

  function getStartPlace() {
    let filePath = 'assets/launches.json'
    if (site.type === 'Landing:') {
      filePath = 'assets/landings.json'
    }
    fetch(filePath
      , {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }).then(response => {
        return response.json()
      }).then(places => {
        const startOrLanding = places.filter(place => {
          if (site.point) {
            return (getDistance(place, site.point) < 100)
          } else {
            return null
          }
        })
        if (startOrLanding[0]) {
          lauchLandingSite.current.value = startOrLanding[0].name
          setLaunchOrLandingName({ type: site.type, name: lauchLandingSite.current.value })
        }
      })
  }
  getStartPlace()

  function handleChange() {
    setLaunchOrLandingName({ type: site.type, name: lauchLandingSite.current.value })
  }

  return (
    <FloatingLabel label={site.type}>
      <Form.Control id='start' type='text' placeholder='Launch' ref={lauchLandingSite} onChange={handleChange} />
    </FloatingLabel>
  )
}
