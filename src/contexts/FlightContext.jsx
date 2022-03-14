import React, { useState } from 'react'
import IGCParser from 'igc-parser'
import { resolvePath } from 'react-router-dom'
import { getRhumbLineBearing, getDistance, getPathLength } from 'geolib'

export const FlightContext = React.createContext()

export default function FlightContextProvider({ children }) {
  const diffData = []

  const flightSpecs = {
    launchPoint: {},
    landingPoint: {},
    launchTime: 0,
    landingTime: 0,
    launchHeight: 0,
    flightType: 0,
    maxSpeed: 0,
    minSpeed: 0,
    maxClimb: 0,
    maxSink: 0,
    maxDist: 0,
    pathLength: 0,
    launchLandingDist: 0,
    duration: 'Duration: --:--:--',
    flightDate: 'Date: ....-..-..',
    maxHeigth: 'Max Height: ----m'
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
    flightSpecs: flightSpecs,
    loadIgcFile: loadIgcFile,
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
      console.log('parsing igc file')
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        const text = reader.result
        let igc = IGCParser.parse(text)
        //setIgcObject(igc)
        console.log(igc)
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
    flightSpecs.launchPoint = findStartingPoint(igcObject)
    flightSpecs.landingPoint = findLandingPoint(igcObject)
    flightSpecs.launchLandingDist = launchLandingDistance(igcObject)
    flightSpecs.pathLength = getPathLength(igcObject.fixes) / 1000
    let start = igcObject.fixes[0]
    igcObject.fixes.forEach(fix => {
      flightSpecs.maxHeight = fix.pressureAltitude > flightSpecs.maxHeight ? fix.pressureAltitude : flightSpecs.maxHeight
      const distance = getDistance(start, fix) / 1000
      flightSpecs.maxDistance = distance > flightSpecs.maxDistance ? distance : flightSpecs.maxDistance
    })
  }

  function getDifferentialData(igcObject) {
    let prevFix = igcObject.fixes[0]
    let prevVspeeds = [0]
    let prevHspeeds = [0]
    let avgVspeed = 0
    let avgHspeed = 0
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
  }

  return (
    <FlightContext.Provider value={flightContextValue}>
      {children}
    </FlightContext.Provider>
  )
}
