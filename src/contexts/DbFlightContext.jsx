import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import app from '../firebase'
import { getDatabase, onValue, ref } from 'firebase/database'

export const DbFlightContext = React.createContext()

export default function DbFlightContextProvider({ children }) {
  const { currentUser } = useAuth()
  const [flights, setFlights] = useState()
  const [flightDetails, setFlightDetails] = useState()

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

  const dbFlightContextValue = {
    dbEventBus,
    flights,
    flightDetails,
    sortFlights: sortFlights,
    getAllFlights: getAllFlights,
    getFlightDetails: getFlightDetails
  }

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
      console.log(combined)
      setFlights(combined.sort((a, b) => (a.flightData.flightDate > b.flightData.flightDate ? 1 : -1)))
    })
    // unsubscribe.apply() //! How to unsubscribe?
  }

  //! This is not needed. Just set the id as "the active flight" and place an event somehow, 
  //! navigate to FlightContainer and implement there the population of the fields...
  function getFlightDetails(flightId) {
    const db = getDatabase(app)
    const flightRef = ref(db, `${currentUser.uid}/flights/${flightId}`)
    const unsubscribe = onValue(flightRef, (snapshot) => {
      setFlightDetails(snapshot.val())
      console.log(snapshot.val())
      //! Put an event dispatcher here, I guess? or trigger somehow the rendering of a flightContainer...
    })
    // unsubscribe.apply() //! How to unsubscribe?
  }

  function sortFlights(sortBy) {
    let sorted = []
    switch (sortBy) {
      case 'date':
        sorted = flights.sort((a, b) => (a.flightData.flightDate > b.flightData.flightDate ? 1 : -1))
        break
      case 'duration':
        sorted = flights.sort((a, b) => (a.flightData.duration < b.flightData.duration ? 1 : -1))
        break
      case 'height':
        sorted = flights.sort((a, b) => (a.flightData.maxHeight < b.flightData.maxHeight ? 1 : -1))
        break
      case 'launch':
        sorted = flights.sort((a, b) => (a.flightData.launchName > b.flightData.launchName ? 1 : -1))
        break
      case 'landing':
        sorted = flights.sort((a, b) => (a.flightData.landingName > b.flightData.landingName ? 1 : -1))
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
