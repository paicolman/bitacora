import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import app from '../firebase'
import { getDatabase, query, orderByChild, onValue, ref } from 'firebase/database'
import { getStorage, ref as storageRef, uploadBytes } from 'firebase/storage'

export const DbFlightContext = React.createContext()

export default function DbFlightContextProvider({ children }) {
  const { currentUser } = useAuth()
  const [flights, setFlights] = useState()

  const dbFlightContextValue = {
    flights,
    sortFlights: sortFlights,
    getAllFlights: getAllFlights
  }

  function getAllFlights() {
    const db = getDatabase(app)
    const flightsRef = query(ref(db, `${currentUser.uid}/flights`), orderByChild('/flightDate'))
    const unsubscribe = onValue(flightsRef, (snapshot) => {
      setFlights(Object.values(snapshot.val()).sort((a, b) => (a.flightDate > b.flightDate ? 1 : -1)))
    })
    // unsubscribe.apply()
  }

  function sortFlights(sortBy) {
    let sorted = []
    switch (sortBy) {
      case 'date':
        sorted = flights.sort((a, b) => (a.flightDate > b.flightDate ? 1 : -1))
        break
      case 'duration':
        sorted = flights.sort((a, b) => (a.duration < b.duration ? 1 : -1))
        break
      case 'height':
        sorted = flights.sort((a, b) => (a.maxHeight < b.maxHeight ? 1 : -1))
        break
      case 'launch':
        sorted = flights.sort((a, b) => (a.launchName > b.launchName ? 1 : -1))
        break
      case 'landing':
        sorted = flights.sort((a, b) => (a.landingName > b.landingName ? 1 : -1))
        break
      default:
        sorted = flights.sort((a, b) => (a.flightDate > b.flightDate ? 1 : -1))
        break
    }
    setFlights([...sorted])
  }

  return (
    <DbFlightContext.Provider value={dbFlightContextValue}>
      {children}
    </DbFlightContext.Provider>
  )
}
