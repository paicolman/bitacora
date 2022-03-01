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
    initPilotLogBook: initPilotLogBook,
    pilotIsRegistered: pilotIsRegistered,
    getProfileData: getProfileData,

    updateMainData: updateMainData
  }

  let licensesList = []
  let glidersList = []

  function updateMainData(mainData, callback) {
    const db = getDatabase(app)
    const pilotRef = ref(db, `${currentUser.uid}/profile/mainData`)
    onValue(pilotRef, (snapshot) => {
      set(pilotRef, {
        pilotName: mainData.pilotName,
        flyingSince: mainData.flyingSince
      })
      callback()
    })
  }

  function updateLicenses(licenses) {
    licensesList = [...licenses]
  }

  function getLicenses() {
    return licensesList
  }

  function updateGliders(gliders) {
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

  function pilotIsRegistered() {
    const db = getDatabase(app)
    const dbRef = ref(db)
    let pilotRegistered = false
    const checkRegisteredPilot = new Promise((resolve) => {

      onValue(dbRef, (snapshot) => {
        try {
          const registeredPilots = Object.keys(snapshot.val())
          if (currentUser) {
            pilotRegistered = registeredPilots.filter((regPilot) => {
              return regPilot === currentUser.uid
            }).length > 0
            resolve(pilotRegistered ? 'registered' : 'unregistered')
          } else {
            resolve('inexistent')
          }
        } catch {
          console.warn('FODEU TUDO MANO')
          resolve('unregistered')
        }
      })


    })
    return checkRegisteredPilot
  }

  function getProfileData() {
    console.log('getting profile data...')
    const db = getDatabase(app)
    const pilotRef = ref(db, `${currentUser.uid}/profile`)
    const pilotDataReady = new Promise((resolve, reject) => {
      onValue(pilotRef, (snapshot) => {
        resolve(snapshot.val())
      })
    })
    return pilotDataReady
  }

  let preventFlood = false //TODO: Check if this is still needed

  function initPilotLogBook() {
    const db = getDatabase(app)
    const dbRef = ref(db)

    onValue(dbRef, (snapshot) => {
      //const registeredPilots = Object.keys(snapshot.val())
      const pilotExist = true
      console.log('Set Breakpoint here...')
      // registeredPilots.filter((regPilot) => {
      //   return regPilot === currentUser.uid
      // }).length > 0
      if (!preventFlood) {
        const newPilotRef = child(dbRef, `${currentUser.uid}`)
        set(newPilotRef, {
          profile: {
            mainData: {
              pilotName: userName,
              flyingSince: flyingSince,
            },
            licenses: licensesList,
            gliders: glidersList,
          }

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
