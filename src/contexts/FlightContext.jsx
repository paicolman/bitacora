import React, { useState } from 'react'
import IGCParser from 'igc-parser'
import { resolvePath } from 'react-router-dom'

export const FlightContext = React.createContext()

export default function FlightContextProvider({ children }) {
  // const [loading, setLoading] = useState(true)

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
    loadIgcFile: loadIgcFile,
    parseIgcFile: parseIgcFile
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
        resolve(igc)
      }
      if (igcFile) {
        reader.readAsText(igcFile)
      } else {
        reject('Shit did not read dude')
      }
    })
  }

  return (
    <FlightContext.Provider value={flightContextValue}>
      {children}
    </FlightContext.Provider>
  )
}
