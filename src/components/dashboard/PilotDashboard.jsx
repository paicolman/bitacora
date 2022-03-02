import React, { useContext, useState } from 'react'
import { AuthProvider } from '../../contexts/AuthContext';
import { ProfileDataContext, ProfileDataProvider } from '../../contexts/ProfileDataContext'
import { Col, Row, Card } from 'react-bootstrap'
import ShowMainData from './ShowMainData'

export default function PilotDashboard() {
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

  console.log(profileData)

  if (!dataReady) {
    getProfileDataFromDb()
  }

  function glidersList() {
    let retVal = <Col sm>please wait...</Col>
    if (dataReady) {
      retVal = profileData?.gliders?.map((glider, idx) => {
        return (
          <Row key={`gliders-${idx}`}>
            <Col sm className='text-center rounded-box pt-3 m-3'>
              <Row><Col sm><h4>{glider.type}</h4></Col></Row>
              <Row><Col sm><h5>{glider.manufacturer}</h5></Col></Row>
              <Row><Col sm><h5>{glider.model}</h5></Col></Row>
            </Col>
            <Col sm>
              <img alt='Pic of a HG' className='img-fluid rounded shadow-2-strong pt-2' src='https://upload.wikimedia.org/wikipedia/commons/d/d1/Hang_gliding_hyner.jpg' />
            </Col>
          </Row>
        )
      })
    }
    return retVal
  }


  return (
    <>
      <div className='profile-container'>
        <AuthProvider>
          <ProfileDataProvider>
            <ShowMainData />
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
            <Card className='text-center'>
              <Card.Header><h3>Your Gliders</h3></Card.Header>
              <Card.Title>Here are your flying machines!</Card.Title>
              <Card.Body>
                {glidersList()}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  )
}
