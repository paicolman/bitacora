import React from 'react'
import { Form, Col, Container, Row, Card, FloatingLabel } from 'react-bootstrap'
import DropzoneFlight from './DropzoneFlight'
import FlightContextProvider from '../contexts/FlightContext'
import FlightMap from './FlightMap'


export default function FlightContainer() {

  //const { getPilotProfileData } = useContext(PilotDataContext)

  function getPilotDataFromDb() {
    console.log('Getting pilot data from db')
    // getPilotProfileData('IrgendEineID')
    return 'irgend ein String'
  }

  return (
    <>
      <FlightContextProvider>
        <Container>
          <Row>
            <DropzoneFlight />
          </Row>
          <Row>
            <FlightMap />
          </Row>
          <Row>
            <Col sm>
              <h2>Date XX.XX.XXXX</h2>
            </Col>
            <Col sm>
              <h2>{getPilotDataFromDb()}</h2>
            </Col>
          </Row>
          <Row>
            <Col sm>
              <FloatingLabel controlId='glider' label='Glider:'>
                <Form.Select id='glider'>
                  <option value='1'>Sport3</option>
                  <option value='2'>Geccko</option>
                  <option value='3'>T2C</option>
                </Form.Select>
              </FloatingLabel>

            </Col>
            <Col sm>
              <FloatingLabel controlId='flightType' label='Flight type:'>
                <Form.Select id='flightType'>
                  <option value='1'>Top-down flight</option>
                  <option value='2'>Soaring / thermal flight</option>
                  <option value='3'>Cross-country</option>
                </Form.Select>
              </FloatingLabel>
            </Col>
          </Row>
          <Row className='pt-4'>
            <Col sm>
              <Card>
                <Card.Body>
                  <Card.Title>Track</Card.Title>
                  <Card.Img variant='top' style={{ width: '100%', height: '200px' }} />
                </Card.Body>
              </Card>
            </Col>
            <Col sm>
              <FloatingLabel label='Start:'>
                <Form.Control id='start' type='text' defaultValue='Mostelegg' />
              </FloatingLabel>
              <FloatingLabel className='pt-2 p-0' label='Landing:'>
                <Form.Control id='landin' type='text' defaultValue='Steinen' />
              </FloatingLabel>
              <Row className='pt-2'>
                <Col sm>
                  <FloatingLabel label='Start Height:'>
                    <Form.Control id='st-height' type='number' defaultValue='1800' />
                  </FloatingLabel>
                  <FloatingLabel className='pt-2' label='Flight Duration:'>
                    <Form.Control id='duration' type='time' defaultValue='03:45' />
                  </FloatingLabel>
                </Col>
                <Col sm>
                  <FloatingLabel label='Max. Height:'>
                    <Form.Control id='max-height' type='number' defaultValue='2300' />
                  </FloatingLabel>
                  <FloatingLabel className='pt-2' label='Wind direction:'>
                    <Form.Control id='wind' type='text' defaultValue='East' />
                  </FloatingLabel>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col sm>
              <FloatingLabel className='pt-2' label='Flight Comments:'>
                <Form.Control as="textarea" rows={6} />
              </FloatingLabel>
            </Col>
          </Row>
          <Row className='pt-2'>
            <Col sm>
              <Card>
                <Card.Body>
                  <Card.Title>Flight Curve</Card.Title>
                  <Card.Img variant='top' style={{ width: '100%', height: '200px' }} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </FlightContextProvider>
    </>
  )
}
