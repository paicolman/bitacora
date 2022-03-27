import React, { useContext, useState } from 'react'
import { AuthProvider } from '../../contexts/AuthContext';
import { ProfileDataContext, ProfileDataProvider } from '../../contexts/ProfileDataContext'
import { Container, Col, Row, Card } from 'react-bootstrap'
import ShowMainData from './ShowMainData'
import ShowGliders from './ShowGliders'
import AppHeader from '../AppHeader'

export default function PilotDashboard({ newPilot }) {
  const [dataReady, setDataReady] = useState(false)
  const [profileData, setProfileData] = useState(null)
  const { getProfileData } = useContext(ProfileDataContext)

  async function getProfileDataFromDb() {
    if (!dataReady) {
      setDataReady(true)
      const data = await getProfileData()
      setProfileData(data)
    }
  }

  if (!dataReady) {
    getProfileDataFromDb()
  }

  return (
    <>

      <Container>
        <AppHeader props={{ home: false, logoutUser: true }} />
        <div className='profile-container'>
          <AuthProvider>
            <ProfileDataProvider>
              <ShowMainData newPilot={newPilot} />
            </ProfileDataProvider>
          </AuthProvider>
          <Row>
            <Col sm>
              <Card className='text-center'>
                <Card.Header><h3>Your Equipment</h3></Card.Header>
                <Card.Title>
                  Here you can find all your gadgets and gimmicks...
                </Card.Title>
              </Card>
            </Col>
            <Col sm>
              <ProfileDataProvider>
                <ShowGliders />
              </ProfileDataProvider>
            </Col>
          </Row>
        </div>
      </Container>
    </>
  )
}
