import React, { useState } from 'react'
import IGCParser from 'igc-parser'
import { resolvePath } from 'react-router-dom'
import { getRhumbLineBearing, getDistance, getPathLength } from 'geolib'

export const FlightContext = React.createContext()

export default function FlightContextProvider({ children }) {
  const diffData = []
  let maxHeight = 0
  let maxClimb = 0
  let maxSink = 0
  let maxSpeed = 0
  let maxDistance = 0
  let pathLength = 0
  let diffDataCalculated = false

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
    diffDataCalculated,
    getMaxClimb: getMaxClimb,
    getMaxSink: getMaxSink,
    getMaxSpeed: getMaxSpeed,
    diffData,
    loadIgcFile: loadIgcFile,
    parseIgcFile: parseIgcFile,
    findStartingPoint: findStartingPoint,
    findLandingPoint: findLandingPoint,
    getMaxHeight: getMaxHeight,
    getMaxDistance: getMaxDistance,
    launchLandingDistance: launchLandingDistance,
    getPathLen: getPathLen
  }


  function loadIgcFile(igcFile) {
    parseIgc(igcFile)
  }

  function parseIgc(igcFile) {
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
        console.log(maxClimb, maxSink, maxSpeed)
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
    let start = igcObject.fixes[0]
    pathLength = getPathLength(igcObject.fixes) / 1000
    console.log(pathLength)
    igcObject.fixes.forEach(fix => {
      maxHeight = fix.pressureAltitude > maxHeight ? fix.pressureAltitude : maxHeight
      const distance = getDistance(start, fix) / 1000
      maxDistance = distance > maxDistance ? distance : maxDistance
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

        maxSpeed = maxSpeed > avgHspeed ? maxSpeed : avgHspeed

        prevVspeeds.push(vSpeed)
        if (idx > 30) {
          prevVspeeds.shift()
        }
        avgVspeed = (prevVspeeds.reduce((tot, elem) => { return (tot + elem) })) / prevVspeeds.length
        maxClimb = maxClimb > avgVspeed ? maxClimb : avgVspeed
        maxSink = maxSink < avgVspeed ? maxSink : avgVspeed


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
    diffDataCalculated = true
  }

  function getMaxHeight() { return maxHeight.toFixed(2) }
  function getMaxSpeed() { return maxSpeed.toFixed(2) }
  function getMaxClimb() { return maxClimb.toFixed(2) }
  function getMaxSink() { return maxSink.toFixed(2) }
  function getMaxDistance() { return maxDistance.toFixed(2) }
  function getPathLen() { return pathLength }

  return (
    <FlightContext.Provider value={flightContextValue}>
      {children}
    </FlightContext.Provider>
  )
}
