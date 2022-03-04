import React, { useState } from 'react'
import { Button, Card, Col, InputGroup, Modal, FloatingLabel, Form, Row, Container } from 'react-bootstrap'


export default function ShowGliderDetails({ props }) {
  const [show, setShow] = useState(true);

  const gliderName = props.glider.nickname ? `${props.glider.nickname}` : `${props.glider.model}`

  function handleClose() {
    console.log(props)
    setShow(false)
    props.onClose()
  }

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>{gliderName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Card>
          <Card.Body>
            <img alt='Pic of a HG' className='img-fluid rounded shadow-2-strong pt-2' src='https://upload.wikimedia.org/wikipedia/commons/d/d1/Hang_gliding_hyner.jpg' />
            <Container>
              <Row>
                <Col sm><h4>{props.glider.type}</h4></Col>
              </Row>
              <Row>
                <Col sm>
                  <Form.Text>
                    Manufacturer:<br />
                  </Form.Text>
                  {props.glider.manufacturer}
                </Col>
                <Col sm>
                  <Form.Text>
                    Model:<br />
                  </Form.Text>
                  {props.glider.model}
                </Col>
              </Row>
              <Row>
                <Col sm>
                  <Form.Text>
                    Purchased on:<br />
                  </Form.Text>
                  {props.glider.purchased}
                </Col>
                <Col sm>
                  <Form.Text>
                    Last check:<br />
                  </Form.Text>
                  {props.glider.lastCheck}
                </Col>
              </Row>
            </Container>
          </Card.Body>
        </Card>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
