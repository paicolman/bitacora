import React, { useState } from 'react'
import IGCParser from 'igc-parser'
import { resolvePath } from 'react-router-dom'
import { getRhumbLineBearing, getDistance } from 'geolib'

export const FlightContext = React.createContext()

export default function FlightContextProvider({ children }) {
  const diffData = []
  const maxSteigen = 0
  const maxSinken = 0
  const maxSpeed = 0
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
    maxSteigen,
    maxSinken,
    maxSpeed,
    diffData,
    loadIgcFile: loadIgcFile,
    parseIgcFile: parseIgcFile,
    findStartingPoint: findStartingPoint,
    findLandingPoint: findLandingPoint,
    getMaxHeight: getMaxHeight
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

  function getMaxHeight(igcObject) {
    let maxAltitude = 0
    igcObject.fixes.forEach(fix => {
      maxAltitude = fix.pressureAltitude > maxAltitude ? fix.pressureAltitude : maxAltitude
    })
    return maxAltitude
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
        avgHspeed = (prevHspeeds.reduce((tot, elem) => { return (tot + elem) })) / prevHspeeds.length

        prevVspeeds.push(vSpeed)
        if (idx > 30) {
          prevVspeeds.shift()
        }
        avgVspeed = (prevVspeeds.reduce((tot, elem) => { return (tot + elem) })) / prevVspeeds.length


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

  return (
    <FlightContext.Provider value={flightContextValue}>
      {children}
    </FlightContext.Provider>
  )
}
