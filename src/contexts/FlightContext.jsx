import React, { useState } from 'react'
import IGCParser from 'igc-parser'
import { getRhumbLineBearing, getDistance, getPathLength } from 'geolib'
import { useAuth } from '../contexts/AuthContext'
import app from '../firebase'
import { getDatabase, onValue, ref, set } from 'firebase/database'
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, updateMetadata } from 'firebase/storage'
import uuid from 'react-uuid'
import PleaseWait from '../components/PleaseWait'

export const FlightContext = React.createContext()

export default function FlightContextProvider({ children }) {
  const [pleaseWait, setPleaseWait] = useState(null)
  const { currentUser } = useAuth()
  const hSpeedAvgRate = 50
  const vSpeedAvgRate = 20

  const diffData = []
  let isThermalFlight = false
  let isXcountry = false
  let igcFileForDB = null

  const flightSpecs = {
    launch: {},
    landing: {},
    launchTime: 0,
    landingTime: 0,
    launchHeight: 0,
    flightType: 'top-down',
    maxSpeed: 0,
    maxClimb: 0,
    maxSink: 0,
    maxDist: 0,
    pathLength: 0,
    launchLandingDist: 0,
    duration: '00:00:00',
    flightDate: 'yyyy-mm-dd',
    maxHeight: 0,
    launchName: '',
    landingName: '',
    gliderId: 0,
    usedLicense: '',
    hasIgc: false
  }

  const eventBus = {
    on(event, callback) {
      document.addEventListener(event, (e) => callback(e.detail));
    },
    dispatch(event, data) {
      document.dispatchEvent(new CustomEvent(event, { detail: data }));
    },
    remove(event, callback) {
      document.removeEventListener(event, callback);
    },
  };

  function loadIgcFile(igcFile) {
    parseIgcFile(igcFile).then((igc) => {
      if (igc) {
        igcFileForDB = igcFile
        eventBus.dispatch('igcParsed', igc)
      }
    }).catch(e => {
      console.error('Error parsing IGC File')
      console.error(e)
    })
  }


  function discardIgc() {
    eventBus.dispatch('newFile', null)
  }

  function setIgcFileForDB(igc) {
    if (igc) {
      igcFileForDB = igc
    }
  }

  function loadIgcFromDB(igcId) {
    setPleaseWait(<PleaseWait />)
    const storage = getStorage()
    getDownloadURL(storageRef(storage, `${currentUser.uid}/igc/${igcId}.igc`))
      .then((igcUrl) => {
        const xhr = new XMLHttpRequest()
        xhr.responseType = 'blob'
        xhr.headers = { 'Access-Control-Allow-Origin': '*', }
        xhr.onload = (event) => {
          loadIgcFile(xhr.response)
        }
        xhr.onerror = (response) => {
          console.error(response)
        }
        xhr.open('GET', igcUrl)
        xhr.send()
      })
  }

  function parseIgcFile(igcFile) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onabort = () => console.error('file reading was aborted')
      reader.onerror = () => console.error('file reading has failed')
      reader.onload = () => {
        const text = reader.result
        let igc = IGCParser.parse(text)
        diffData.length = 0
        flightSpecs.hasIgc = true
        clearFlightSpecs()
        getDirectData(igc)
        getDifferentialData(igc)
        setPleaseWait(null)
        resolve(igc)
      }
      if (igcFile) {
        reader.readAsText(igcFile)
      } else {
        reject('Could not read the selected file')
      }
    })
  }

  function clearFlightSpecs() {
    flightSpecs.launch = {}
    flightSpecs.landing = {}
    flightSpecs.launchTime = 0
    flightSpecs.landingTime = 0
    flightSpecs.launchHeight = 0
    flightSpecs.flightType = 'top-down'
    flightSpecs.maxSpeed = 0
    flightSpecs.maxClimb = 0
    flightSpecs.maxSink = 0
    flightSpecs.maxDist = 0
    flightSpecs.pathLength = 0
    flightSpecs.launchLandingDist = 0
    flightSpecs.duration = '--:--:--'
    flightSpecs.flightDate = '....-..-..'
    flightSpecs.maxHeight = 0
    flightSpecs.launchName = ''
    flightSpecs.landingName = ''
  }

  function findStartingPoint(igcObject) {
    const firstAltitude = igcObject.fixes[0].pressureAltitude
    return igcObject.fixes.find(fix => {
      return fix.pressureAltitude !== firstAltitude
    })
  }

  function findLandingPoint(igcObject) {
    const lastAltitude = igcObject.fixes[igcObject.fixes.length - 1].pressureAltitude
    return igcObject.fixes.find(fix => {
      return fix.pressureAltitude === lastAltitude
    })
  }

  function launchLandingDistance(igcObject) {
    return getDistance(igcObject.fixes[igcObject.fixes.length - 1], igcObject.fixes[0]) / 1000
  }

  function getDirectData(igcObject) {
    flightSpecs.launch = findStartingPoint(igcObject)
    flightSpecs.landing = findLandingPoint(igcObject)
    flightSpecs.launchLandingDist = launchLandingDistance(igcObject)
    flightSpecs.pathLength = getPathLength(igcObject.fixes) / 1000
    let start = igcObject.fixes[0]
    igcObject.fixes.forEach(fix => {
      flightSpecs.maxHeight = fix.pressureAltitude > flightSpecs.maxHeight ? fix.pressureAltitude : flightSpecs.maxHeight
      const distance = getDistance(start, fix) / 1000
      flightSpecs.maxDist = distance > flightSpecs.maxDist ? distance : flightSpecs.maxDist
    })
    isXcountry = flightSpecs.maxDist > 15 // More than 15 km away is X-country
  }

  function getDifferentialData(igcObject) {
    let prevFix = igcObject.fixes[0]
    let prevVspeeds = [0]
    let prevHspeeds = [0]
    let avgVspeed = 0
    let avgHspeed = 0
    let climbDataPoints = 0
    let sinkDataPoints = 0
    igcObject.fixes.forEach((fix, idx) => {
      if (idx > 0) {
        const deltaT = ((fix.timestamp - prevFix.timestamp) / 1000)
        const vSpeed = (fix.pressureAltitude - prevFix.pressureAltitude) / deltaT
        const bear = getRhumbLineBearing(fix, prevFix)
        const hSpeed = Math.round(getDistance(fix, prevFix) * 3.6 * 100) / 100

        prevHspeeds.push(hSpeed)
        if (idx > hSpeedAvgRate) {
          prevHspeeds.shift()
        }
        avgHspeed = ((prevHspeeds.reduce((tot, elem) => { return (tot + elem) })) / prevHspeeds.length)
        flightSpecs.maxSpeed = flightSpecs.maxSpeed > avgHspeed ? flightSpecs.maxSpeed : avgHspeed

        prevVspeeds.push(vSpeed)
        if (idx > vSpeedAvgRate) {
          prevVspeeds.shift()
        }
        avgVspeed = (prevVspeeds.reduce((tot, elem) => { return (tot + elem) })) / prevVspeeds.length
        flightSpecs.maxClimb = flightSpecs.maxClimb > avgVspeed ? flightSpecs.maxClimb : avgVspeed
        flightSpecs.maxSink = flightSpecs.maxSink < avgVspeed ? flightSpecs.maxSink : avgVspeed
        if (avgVspeed > 0) {
          climbDataPoints++
        } else {
          sinkDataPoints++
        }

        diffData.push({
          verticalSpeed: avgVspeed,
          speed: avgHspeed,
          bearing: bear,
          latitude: fix.latitude,
          longitude: fix.longitude,
          time: fix.time
        })
        prevFix = fix
      }
    })
    isThermalFlight = (climbDataPoints / sinkDataPoints) > 0.25 // More than 25% of the time climbing
    flightSpecs.flightType = 'top-down'
    if (isThermalFlight) {
      flightSpecs.flightType = 'thermal'
      if (isXcountry) {
        flightSpecs.flightType = 'x-country'
      }
    }
  }

  function getStartOrLanding(site, callback) {
    const filePath = 'assets/flyingSpots.json'
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
          if (site.point) { // && !isNaN(parseFloat(place.longitude)) && isNaN(parseFloat(place.latitude))
            const dist = getDistance(place, site.point)
            return (dist < 300)
          } else {
            return null
          }
        })
        callback(startOrLanding[0])
        if (startOrLanding[0]) {
          setLaunchOrLandingName({ type: site.type, name: startOrLanding[0].name })
        } else {
          setLaunchOrLandingName({ type: site.type, name: '' })
        }
      })
  }

  function setLaunchOrLandingName(siteInfo) {
    if (siteInfo.type === 'Launch:') {
      flightSpecs.launchName = siteInfo.name
    } else {
      flightSpecs.landingName = siteInfo.name
    }
  }

  function setFlightDate(dateInfo) {
    flightSpecs.flightDate = dateInfo
    eventBus.dispatch('newDate')
  }

  function setMaxHeight(heightInfo) {
    flightSpecs.maxHeight = heightInfo
  }

  function setSelectedGlider(gliderInfo) {
    flightSpecs.gliderId = gliderInfo.id
  }

  function setUsedLicense(licenseInfo) {
    flightSpecs.usedLicense = licenseInfo
  }

  async function saveFlightData(dataToSave, existingFlightId) {
    flightSpecs.duration = dataToSave.duration
    flightSpecs.flightType = dataToSave.flightType
    flightSpecs.landingTime = dataToSave.landingTime
    flightSpecs.launchHeight = isNaN(dataToSave.launchHeight) ? 0 : dataToSave.launchHeight
    flightSpecs.launchLandingDist = isNaN(dataToSave.launchlandDist) ? 0 : dataToSave.launchlandDist
    flightSpecs.launchTime = dataToSave.launchTime
    flightSpecs.maxClimb = isNaN(dataToSave.maxClimb) ? 0 : dataToSave.maxClimb
    flightSpecs.maxDist = isNaN(dataToSave.maxDist) ? 0 : dataToSave.maxDist
    flightSpecs.maxSink = isNaN(dataToSave.maxSink) ? 0 : dataToSave.maxSink
    flightSpecs.maxSpeed = isNaN(dataToSave.maxSpeed) ? 0 : dataToSave.maxSpeed
    flightSpecs.pathLength = isNaN(dataToSave.pathLength) ? 0 : dataToSave.pathLength
    flightSpecs.comments = dataToSave.comments
    if (existingFlightId) {
      return updateFlight(existingFlightId)
    } else {
      return storeNewFlight()
    }
  }

  function storeIgc(uniqueId) {
    const storage = getStorage()
    const igcRef = storageRef(storage, `${currentUser.uid}/igc/${uniqueId}.igc`)
    uploadBytes(igcRef, igcFileForDB).then((snapshot) => {
    })
  }

  function getExistingFlightId() {
    return new Promise(resolve => {
      const db = getDatabase(app)
      const existingFlightsRef = ref(db, `${currentUser.uid}/flights`)
      let duplicate = false
      let existingflightId = null
      const unsuscribeExisting = onValue(existingFlightsRef, (snapshot) => {
        const flights = snapshot.val()
        for (const flightId in flights) {
          duplicate = (flights[flightId].flightDate === flightSpecs.flightDate) && (flights[flightId].launchTime === flightSpecs.launchTime)
          if (duplicate) {
            console.warn('Duplicate flight')
            console.warn(flights[flightId].flightDate, flightSpecs.flightDate, flights[flightId].launchTime, flightSpecs.launchTime)
            existingflightId = flightId
            break
          }
        }
        resolve(existingflightId)
      })
      unsuscribeExisting.apply()
    })
  }

  function storeNewFlight() {
    return new Promise(resolve => {
      const db = getDatabase(app)
      const flightId = uuid()
      const flightRef = ref(db, `${currentUser.uid}/flights/${flightId}`)
      const unsubscribeNew = onValue(flightRef, () => {
        set(flightRef, flightSpecs)
        if (igcFileForDB) {
          storeIgc(flightId)
        }
        resolve('UPLOADED')
      }, (err) => {
        console.error(err)
        resolve(err)
      }, false)
      unsubscribeNew.apply()
    })
  }

  function updateFlight(flightId) {
    return new Promise((resolve, reject) => {
      const db = getDatabase(app)
      const flightRef = ref(db, `${currentUser.uid}/flights/${flightId}`)
      const unsubscribe = onValue(flightRef, () => {
        set(flightRef, flightSpecs)
        resolve('UPLOADED')
      }, (err) => {
        console.error(err)
        resolve(err)
      }, false)
      unsubscribe.apply()
    })
  }

  const flightContextValue = {
    eventBus,
    diffData,
    flightSpecs: flightSpecs,
    loadIgcFile,
    loadIgcFromDB,
    discardIgc,
    parseIgcFile,
    setIgcFileForDB,
    getStartOrLanding,
    setLaunchOrLandingName,
    setFlightDate,
    setMaxHeight,
    setSelectedGlider,
    setUsedLicense,
    saveFlightData,
    getExistingFlightId,
    storeNewFlight
  }

  return (
    <FlightContext.Provider value={flightContextValue}>
      {pleaseWait}
      {children}
    </FlightContext.Provider>
  )
}
