import React, { useRef, useState, useContext } from 'react'
import { ProfileDataContext } from '../contexts/ProfileDataContext'
import { useAuth } from '../contexts/AuthContext'
import { LicensesList } from './LicensesList'
import { Button, Form, Col, Container, Row, Card, FloatingLabel, Alert } from 'react-bootstrap'
import GliderList from './GliderList'

export default function UpdateProfile() {

  // const { initPilotLogBook } = useContext(PilotDataContext)
  const { getLicenses, getGliders, setUserName, setFlyingSince, initPilotLogBook } = useContext(ProfileDataContext)
  const { currentUser } = useAuth()
  const userNameRef = useRef()
  const flyingSinceRef = useRef()
  const userNameColRef = useRef()
  const flyingSinceColRef = useRef()
  const licensesRef = useRef()
  const glidersRef = useRef()
  const [show, setShow] = useState(false);

  function validateData() {
    userNameColRef.current.style.border = '0px'
    flyingSinceColRef.current.style.border = '0px'
    licensesRef.current.style.border = '0px'
    glidersRef.current.style.border = '0px'
    if (userNameRef.current.value.length === 0) { userNameColRef.current.style.border = '1px dashed red' }
    if (flyingSinceRef.current.value.length === 0) { flyingSinceColRef.current.style.border = '1px dashed red' }
    if (getLicenses().length === 0) { licensesRef.current.style.border = '1px dashed red' }
    if (getGliders().length === 0) { glidersRef.current.style.border = '1px dashed red' }
    return (
      userNameRef.current.value.length > 0 &&
      flyingSinceRef.current.value.length > 0 &&
      getLicenses().length > 0 &&
      getGliders().length > 0
    )
  }

  function handleUpdateProfile(e) {
    e.preventDefault()
    e.stopPropagation()

    if (validateData()) {
      console.log('Now we would be ready to write to the DB!')
      setUserName(userNameRef.current.value)
      setFlyingSince(flyingSinceRef.current.value)
      initPilotLogBook()
    } else {
      console.log(userNameRef.current.style)
      console.log(flyingSinceRef.current.value)
      console.log(getLicenses().length)
      console.log(getGliders().length)
      console.log(validateData())

      setShow(true)
      setTimeout(() => {setShow(false)},5000)
    }
  }

  function alert() {
    const retVal = show ? (
      <Alert key='incomplete' variant='danger' onClose={() => setShow(false)} dismissible>
        Please fill in all red marked fields!
      </Alert>
    ) : (<></>)
    return retVal
  }

  return (
    <Container>
      <Form>
        <Row>
          <Col sm>
            <h3> Edit User Profile </h3>
          </Col>
        </Row>
        <Row>
          <Card>
            <Card.Body>
              {alert()}
              <Row>
                <Col sm>
                  <h5>User: {currentUser.email}</h5>
                </Col>
                <Col sm className='text-end'>
                  <Button variant='primary' size='lg'>
                    Change Password
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Row>
        <Row>
          <Col sm className='pt-2' ref={userNameColRef}>
            <FloatingLabel controlId='floatingName' label='Your Name' >
              <Form.Control type='text' ref={userNameRef} placeholder='Your Name'/>
            </FloatingLabel>
          </Col>
          <Col sm className='pt-2' ref={flyingSinceColRef}>
            <FloatingLabel controlId='floatingFlyingSince' label='Flying since...' >
              <Form.Control type='date' ref={flyingSinceRef} />
            </FloatingLabel>
          </Col>
        </Row>
        <Row className='pt-2'>
          <Col sm={5} ref={licensesRef}>
            <LicensesList />
          </Col>
          <Col sm ref={glidersRef}>
            <GliderList />
          </Col>
        </Row>
        <Row>
          <Col sm className='text-center pt-3'>
            <Button type='submit' variant='primary' size='lg' onClick={handleUpdateProfile}>
              Update Profile
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  )
}
