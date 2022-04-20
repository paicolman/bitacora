import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import app from '../firebase'
import { getDatabase, onValue, ref, set } from 'firebase/database'
import { getStorage, ref as storageRef, deleteObject } from 'firebase/storage'
import PleaseWait from '../components/PleaseWait'

export const DbFlightContext = React.createContext()

export default function DbFlightContextProvider({ children }) {
  const { currentUser } = useAuth()
  const [flights, setFlights] = useState()
  const [activeFlight, setActiveFlight] = useState()
  const [pleaseWait, setPleaseWait] = useState(null)

  useEffect(() => {
    dbEventBus.dispatch('switchActiveFlight', activeFlight)
  }, [activeFlight])

  const dbEventBus = {
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

  function getAllFlights() {
    const db = getDatabase(app)
    const flightsRef = ref(db, `${currentUser.uid}/flights`)
    const unsubscribe = onValue(flightsRef, (snapshot) => {
      // We have to convert the objec of objects into an array to allow for sorting...
      const flights = Object.values(snapshot.val())
      const flightIds = Object.keys(snapshot.val())
      const combined = flights.map((flight, idx) => {
        return { flightId: flightIds[idx], flightData: flight }
      })
      setFlights(combined.sort((a, b) => (a.flightData.flightDate > b.flightData.flightDate ? 1 : -1)))
    })
    // unsubscribe.apply() //! How to unsubscribe?
  }

  function sortFlights(sortBy, ascending) {
    let sorted = []
    console.log(sortBy)
    switch (sortBy) {
      case 'date':
        sorted = ascending ?
          flights.sort((a, b) => (a.flightData.flightDate > b.flightData.flightDate ? 1 : -1)) :
          flights.sort((a, b) => (a.flightData.flightDate < b.flightData.flightDate ? 1 : -1))
        break
      case 'duration':
        sorted = ascending ?
          flights.sort((a, b) => (a.flightData.duration < b.flightData.duration ? 1 : -1)) :
          flights.sort((a, b) => (a.flightData.duration > b.flightData.duration ? 1 : -1))
        break
      case 'height':
        sorted = ascending ?
          flights.sort((a, b) => (a.flightData.maxHeight < b.flightData.maxHeight ? 1 : -1)) :
          flights.sort((a, b) => (a.flightData.maxHeight > b.flightData.maxHeight ? 1 : -1))
        break
      case 'launch':
        sorted = ascending ?
          flights.sort((a, b) => (a.flightData.launchName > b.flightData.launchName ? 1 : -1)) :
          flights.sort((a, b) => (a.flightData.launchName < b.flightData.launchName ? 1 : -1))
        break
      case 'landing':
        sorted = ascending ?
          flights.sort((a, b) => (a.flightData.landingName > b.flightData.landingName ? 1 : -1)) :
          flights.sort((a, b) => (a.flightData.landingName < b.flightData.landingName ? 1 : -1))
        break
      default:
        sorted = ascending ?
          flights.sort((a, b) => (a.flightDate > b.flightDate ? 1 : -1)) :
          flights.sort((a, b) => (a.flightDate < b.flightDate ? 1 : -1))
        break
    }
    setFlights([...sorted])
  }

  function getPreviousFlight() {
    if (flights.length > 0) {
      const flightIndex = flights.findIndex(flight => flight.flightId === activeFlight.flightId)
      if (flightIndex > 0) {
        setActiveFlight(flights[flightIndex - 1])
        return true
      }
      console.warn('No PREV flight!')
      return false
    } else {
      console.warn('No flights, array empty!')
      return false
    }
  }

  function getNextFlight() {
    if (flights.length > 0) {
      const flightIndex = flights.findIndex(flight => flight.flightId === activeFlight.flightId)
      if (flightIndex < flights.length - 1) {
        setActiveFlight(flights[flightIndex + 1])
        return true
      }
      console.warn('No NEXT flight!')
      return false
    } else {
      console.warn('No flights, array empty!')
      return false
    }
  }

  function getFirstFlight() {
    if (flights.length > 0) {
      setActiveFlight(flights[0])
      return true
    } else {
      console.warn('No flights, array empty!')
      return false
    }
  }

  function deleteFlight() {
    if (activeFlight) {
      return new Promise((resolve, reject) => {
        const flightIndex = flights.findIndex(flight => flight.flightId === activeFlight.flightId)
        flights.splice(flightIndex, 1)
        const db = getDatabase(app)
        const flightRef = ref(db, `${currentUser.uid}/flights/${activeFlight.flightId}`)
        const storage = getStorage()
        const unsubscribe = onValue(flightRef, (snapshot) => {
          set(flightRef, null)
          resolve()
        })
        unsubscribe.apply()
        if (activeFlight.flightData.hasIgc) {
          const igcRef = storageRef(storage, `${currentUser.uid}/igc/${activeFlight.flightId}`)
          deleteObject(igcRef).then(() => {
            resolve()
          }).catch((error) => {
            console.error(error)
            reject()
          })
        }
      })
    }
  }

  const dbFlightContextValue = {
    dbEventBus,
    flights,
    activeFlight,
    setActiveFlight,
    sortFlights,
    getAllFlights,
    deleteFlight,
    getFirstFlight,
    getNextFlight,
    getPreviousFlight
  }

  return (
    <DbFlightContext.Provider value={dbFlightContextValue}>
      {children}
    </DbFlightContext.Provider>
  )
}
