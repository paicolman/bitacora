import React, { useState, useContext, useEffect } from 'react'
import { Button, ListGroup, Modal } from 'react-bootstrap'
import { ProfileDataContext } from '../../contexts/ProfileDataContext'
import { FlightContext } from '../../contexts/FlightContext'

export default function BulkUpload({ files }) {
  const { parseIgcFile, setIgcFileForDB, flightSpecs, getStartOrLanding, setFlightDate, checkAndStoreNewFlight } = useContext(FlightContext)
  const { getProfileData } = useContext(ProfileDataContext)
  const [show, setShow] = useState(true)
  const [uploadNames, setUploadNames] = useState([])
  const [uploadList, setUploadList] = useState([])
  const [uploadStatus, setUploadStatus] = useState([])
  const [uploadStyle, setUploadStyle] = useState([])
  let uploadCount = 0

  useEffect(() => {
    getDataFromDb()

    return () => {
      console.log('Clearing all stuff!')
      setUploadNames([])
      setUploadList([])
      setUploadStatus([])
      setUploadStyle([])
    }
  }, [])

  function handleClose() {
    setShow(false)
    console.log(files[0])
    files[0].onClose()
  }

  async function getDataFromDb() {
    const profileDataFromDb = await getProfileData('/profile')
    let defaultGlider = profileDataFromDb.gliders?.filter(glider => {
      return glider.default
    })
    let defaultLicense = profileDataFromDb.licenses?.filter(license => {
      return license.default
    })
    if (defaultLicense === undefined) {
      defaultLicense = [{ id: '' }]
    }
    if (defaultGlider === undefined) {
      defaultGlider = [{ id: '' }]
    }
    flightSpecs.gliderId = defaultGlider[0].id
    flightSpecs.usedLicense = defaultLicense[0].id
    loadFiles()
  }

  function updateFilesList() {

    const nameList = uploadNames.map((fileName, idx) => {
      return <ListGroup.Item key={`item-${idx}`}>Uploading {fileName}... <span className={uploadStyle[idx]}>{uploadStatus[idx]}</span></ListGroup.Item>
    })
    // console.log(`...Listing file entries...${uploadStatus}`)
    setUploadStatus(uploadStatus)
    setUploadStyle(uploadStyle)
    setUploadNames(uploadNames)
    setUploadList(nameList)
  }

  async function loadFiles() {
    for (const fileIdx in files) {
      // console.log('... loaded file ...')
      await parseAndPopulate(files[fileIdx])
    }
  }

  function parseAndPopulate(file) {
    return new Promise((resolve) => {
      if (!file.import) {
        resolve()
      }
      else {
        uploadNames.push(file.file.name)
        uploadStatus[uploadCount] = 'loaded'
        uploadStyle[uploadCount] = 'ongoing'
        updateFilesList()
        setIgcFileForDB(file.file)
        parseIgcFile(file.file).then((igc) => {
          uploadStatus[uploadCount] = 'parsed'
          updateFilesList()
          // console.log(`... parsed file ... ${uploadCount}`)
          populateFlightSpecs(igc).then(() => {
            // console.log(`... populated flight specs ... ${uploadCount} `)
            uploadStatus[uploadCount] = 'analyzed'
            updateFilesList()
            console.log(`>>> Storing ${file.file.name}`)
            checkAndStoreNewFlight().then((status) => {
              console.log(status)
              finalUploadStatus(status)
              updateFilesList()
              uploadCount++
              resolve()
            })
          })
        })
      }
    })
  }

  function finalUploadStatus(status) {
    uploadStyle[uploadCount] = 'upload-error'
    if (status === 'UPLOADED') {
      uploadStatus[uploadCount] = status
      uploadStyle[uploadCount] = 'uploaded'
      return
    }
    if (status === 'DUPLICATE') {
      uploadStatus[uploadCount] = status
      return
    } else {
      uploadStatus[uploadCount] = 'UPLOAD ERROR'
    }
  }

  function populateFlightSpecs(igc) {
    return new Promise((resolve) => {
      setFlightDate(igc.date)
      flightSpecs.launchTime = flightSpecs.launch.time
      flightSpecs.landingTime = flightSpecs.landing.time
      flightSpecs.duration = calculateDuration(flightSpecs.launchTime, flightSpecs.landingTime)
      flightSpecs.launchHeight = flightSpecs.launch.pressureAltitude
      flightSpecs.comment = ''
      const launch = { type: 'Launch:', point: flightSpecs.launch }
      getStartOrLanding(launch, () => { })
      const landing = { type: 'Landing:', point: flightSpecs.landing }
      getStartOrLanding(landing, () => {
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
      <Modal.Header closeButton onClick={handleClose}>
        <Modal.Title>Bulk upload</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup >
          {uploadList}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Done
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
