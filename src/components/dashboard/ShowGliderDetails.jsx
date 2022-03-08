import React, { useState } from 'react'
import { Button, Card, Col, Modal, Form, Row, Container, Image } from 'react-bootstrap'
import { getStorage, ref, getDownloadURL } from 'firebase/storage'

export default function ShowGliderDetails({ props }) {
  const [show, setShow] = useState(true)
  const [gliderpic, setGliderpic] = useState(null)

  const gliderName = props.glider.nickname ? `${props.glider.nickname}` : `${props.glider.model}`

  function handleClose() {
    console.log(props)
    setShow(false)
    props.onClose()
  }

  getPicUrl()

  function getPicUrl() {
    if (!gliderpic) {
      const storage = getStorage()
      console.log(props.glider.id)
      const storageRef = ref(storage, `${props.glider.id}/images/gliderpic`)
      getDownloadURL(storageRef, `${props.glider.id}/images/gliderpic`).then((url) => {
        console.log(url)
        setGliderpic(url)
      }, () => {
        setGliderpic('/assets/nopic.jpg')
      })
    }
  }

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>{gliderName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Card>
          <Card.Body>
            <Image src={gliderpic} style={{ maxWidth: '100%' }} className='rounded' />
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
