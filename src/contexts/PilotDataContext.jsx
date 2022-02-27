import React from 'react'
import app from '../firebase'
import { useAuth } from "../contexts/AuthContext"
import { getDatabase, onValue, ref, set, child } from 'firebase/database'

export const PilotDataContext = React.createContext()

export function PilotDataProvider({ children }) {

  const pilotDataContextValue = {
    getPilotProfileData: getPilotProfileData,
    initPilotLogBook: initPilotLogBook
  }

  const { currentUser } = useAuth()

  function getPilotProfileData(pilotId) {

    const db = getDatabase(app)
    const dbRef = ref(db, 'pilots/')
    onValue(dbRef, (snapshot) => {
      console.table(snapshot.val())
    })
  }

  let preventFlood = false

  function initPilotLogBook() {
    const db = getDatabase(app)
    const dbRef = ref(db, 'pilots')
    const newPilotRef = child(dbRef, currentUser.uid)
    set(newPilotRef, {profile:null})
    console.log(currentUser.uid)
    // onValue(dbRef, (snapshot) => {
    //   const registeredPilots = Object.keys(snapshot.val())
    //   console.log(registeredPilots)
    //   const pilotExist = registeredPilots.filter(regPilot => { return regPilot === currentUser.uid }).length > 0
      
    //   if (!pilotExist && !preventFlood) {
    //     const newPilotRef = child(dbRef, "pilots/currentUser")
    //     set(newPilotRef, { someKey: "someValue" })
    //     preventFlood = true
    //   }
    // })

  }

  return (
    <PilotDataContext.Provider value={pilotDataContextValue}>
      {children}
    </PilotDataContext.Provider>
  )
}
