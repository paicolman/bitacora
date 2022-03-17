import React, { useState, useContext, useEffect } from 'react'
import { Button, Card, Col, Modal, Form, Row, Container, Image } from 'react-bootstrap'
import { ProfileDataContext } from '../../contexts/ProfileDataContext'
import { FlightContext } from '../../contexts/FlightContext'
import { resolvePath } from 'react-router-dom'


export default function BulkUpload({ files }) {
  const { parseIgcFile, flightSpecs, getStartPlace, setFlightDate, saveFlightData } = useContext(FlightContext)
  const { getProfileData } = useContext(ProfileDataContext)
  const [show, setShow] = useState(true)

  useEffect(() => {
    getDataFromDb()
  }, [])

  async function getDataFromDb() {
    const profileDataFromDb = await getProfileData('/profile')
    const defaultGlider = profileDataFromDb.gliders.filter(glider => {
      return glider.default
    })
    const defaultLicense = profileDataFromDb.licenses.filter(license => {
      return license.default
    })
    flightSpecs.gliderId = defaultGlider[0].id
    flightSpecs.usedLicense = defaultLicense[0].id
    loadFiles()
  }

  async function loadFiles() {
    for (const file in files) {
      await parseAndPopulate(files[file])
    }
  }

  function parseAndPopulate(file) {
    return new Promise((resolve) => {
      if (!file.import) {
        resolve()
      }
      else {
        console.log('Parsing...')
        parseIgcFile(file.file).then((igc) => {
          console.log('Finished Parsing...')
          console.log('Populating...')
          populateFlightSpecs(igc).then(() => {
            console.log('NEXT!')
            resolve()
          })
        })
      }
    })
  }

  function populateFlightSpecs(igc) {
    return new Promise((resolve) => {
      // console.log(igc)
      setFlightDate(igc.date)
      flightSpecs.launchTime = flightSpecs.launch.time
      flightSpecs.landingTime = flightSpecs.landing.time
      flightSpecs.duration = calculateDuration(flightSpecs.launchTime, flightSpecs.landingTime)
      flightSpecs.launchHeight = flightSpecs.landing.pressureAltitude
      flightSpecs.comment = ''
      const launch = { type: 'Launch:', point: flightSpecs.launch }
      getStartPlace(launch, () => { })
      const landing = { type: 'Landing:', point: flightSpecs.landing }
      getStartPlace(landing, () => {
        console.log('Finished populating!')
        console.log(JSON.stringify(flightSpecs))
        resolve()
      })
    })
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

  return (
    <Modal
      show={show}
      backdrop="static"
      keyboard={false}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Bulk upload</Modal.Title>
      </Modal.Header>
      <Modal.Body>

      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary">
          Done
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
