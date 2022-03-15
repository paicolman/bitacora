import React from 'react'
import IGCParser from 'igc-parser'
import { getRhumbLineBearing, getDistance, getPathLength } from 'geolib'

export const FlightContext = React.createContext()

export default function FlightContextProvider({ children }) {
  const diffData = []
  let isThermalFlight = false
  let isXcountry = false

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
    duration: 'Duration: --:--:--',
    flightDate: 'Date: ....-..-..',
    maxHeight: 0,
    launchName: '',
    landingName: '',
    gliderId: 0,
    usedLicense: ''
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

  const flightContextValue = {
    eventBus,
    diffData,
    flightSpecs: flightSpecs,
    loadIgcFile: loadIgcFile,
    setLaunchOrLandingName: setLaunchOrLandingName,
    setFlightDate: setFlightDate,
    setMaxHeight: setMaxHeight,
    setSelectedGlider: setSelectedGlider,
    setUsedLicense: setUsedLicense,
    saveFlightData: saveFlightData
  }


  function loadIgcFile(igcFile) {
    parseIgcFile(igcFile).then((igc) => {
      if (igc) {
        eventBus.dispatch('igcParsed', igc)
      }
    }).catch(e => {
      console.log('Error parsing')
      console.log(e)
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
        //setIgcObject(igc)
        console.log(igc)
        diffData.length = 0
        getDirectData(igc)
        getDifferentialData(igc)
        resolve(igc)
      }
      if (igcFile) {
        reader.readAsText(igcFile)
      } else {
        reject('Shit did not read dude')
      }
    })
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
    console.log(flightSpecs.maxHeight)
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
        const hSpeed = getDistance(fix, prevFix) * 3.6 // kmh

        prevHspeeds.push(hSpeed)
        if (idx > 30) {
          prevHspeeds.shift()
        }
        avgHspeed = ((prevHspeeds.reduce((tot, elem) => { return (tot + elem) })) / prevHspeeds.length) / 3.6
        flightSpecs.maxSpeed = flightSpecs.maxSpeed > avgHspeed ? flightSpecs.maxSpeed : avgHspeed

        prevVspeeds.push(vSpeed)
        if (idx > 30) {
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
          longitude: fix.longitude
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

  function setLaunchOrLandingName(siteInfo) {
    if (siteInfo.type === 'Launch:') {
      flightSpecs.launchName = siteInfo.name
    } else {
      flightSpecs.landingName = siteInfo.name
    }
  }

  function setFlightDate(dateInfo) {
    flightSpecs.flightDate = dateInfo
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

  function saveFlightData(dataToSave) {
    console.log(dataToSave)
    console.log(flightSpecs)

  }

  return (
    <FlightContext.Provider value={flightContextValue}>
      {children}
    </FlightContext.Provider>
  )
}
