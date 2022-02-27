import React, { useContext } from 'react'
import { PilotDataContext } from '../contexts/PilotDataContext'
import { useAuth } from "../contexts/AuthContext"
import { LicensesList } from './LicensesList'
import { Button, Form, Col, Container, Row, Card, FloatingLabel } from 'react-bootstrap'

export default function UpdateProfile() {

  const { initPilotLogBook } = useContext(PilotDataContext)
  const { currentUser } = useAuth()

  return (
    <Container>
      <Row>
        <Col sm>
          <h1> User Profile </h1>
        </Col>
      </Row>
      <Row>
        <Card>
          <Card.Body>
            <Row>
              <Col sm>
                <h3>User: {currentUser.email}</h3>
              </Col>
              <Col sm className="text-end">
                <Button variant="primary" size="lg">
                  Change Password
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Row>
      <Row className="pt-2">
        <Col sm>
          <FloatingLabel controlId='floatingName' label='Your Name' >
            <Form.Control type='text' />
          </FloatingLabel>
        </Col>
        <Col sm>
          <FloatingLabel controlId='floatingFlyingSince' label='Flying since...' >
            <Form.Control type='date' />
          </FloatingLabel>
        </Col>
      </Row>
      <Row className="pt-2">
        <Col sm>
          <LicensesList />
        </Col>
        <Col sm>
          <Card>
            <Card.Body>
              fkjadhf
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
