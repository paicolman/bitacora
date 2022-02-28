import React from 'react'
import app from '../firebase'
import { useAuth } from '../contexts/AuthContext'
import { getDatabase, onValue, ref, set, child } from 'firebase/database'

export const ProfileDataContext = React.createContext()

export function ProfileDataProvider({ children }) {

  let userName = ''
  let flyingSince = new Date()
  const { currentUser } = useAuth()

  const profileDataContextValue = {
    updateLicenses: updateLicenses,
    getLicenses: getLicenses,
    updateGliders: updateGliders,
    getGliders: getGliders,
    setUserName: setUserName,
    setFlyingSince: setFlyingSince,
    initPilotLogBook: initPilotLogBook
  }

  let licensesList = []
  let glidersList = []

  function updateLicenses(licenses){
    licensesList = [...licenses]
  }

  function getLicenses() {
    return licensesList
  }

  function updateGliders(gliders){
    glidersList = [...gliders]
  }

  function getGliders() {
    return glidersList
  }

  function setUserName(name) {
    userName = name
  }

  function setFlyingSince(flyingDate) {
    flyingSince = flyingDate
  }



  let preventFlood = false

  function initPilotLogBook() {
    const db = getDatabase(app)
    const dbRef = ref(db, 'pilots')
    const newPilotRef = child(dbRef, currentUser.uid)
    set(newPilotRef, {profile:null})
    console.log(currentUser.uid)
    onValue(dbRef, (snapshot) => {
      const registeredPilots = Object.keys(snapshot.val())
      console.log(registeredPilots)
      const pilotExist = registeredPilots.filter(regPilot => { return regPilot === currentUser.uid }).length > 0

      if (!pilotExist && !preventFlood) {
        const newPilotRef = child(dbRef, `pilots/${currentUser.uid}`)
        set(newPilotRef, {
          name:userName,
          flyingSince: flyingSince,
          licenses: licensesList,
          gliders: glidersList
        })
        preventFlood = true
      }
    })
  }


  return (
    <ProfileDataContext.Provider value={profileDataContextValue}>
      {children}
    </ProfileDataContext.Provider>
  )

}
