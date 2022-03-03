import React, { useState, useRef, useEffect } from 'react'
import { Accordion, Button, Card, Col, InputGroup, Modal, FloatingLabel, Form, Row, CardGroup } from 'react-bootstrap'

export default function EditGliders({ props }) {
  const [show, setShow] = useState(true);
  const [gliders, setGliders] = useState(props.gliders)
  const licensesInputRef = useRef()

  function handleAddGlider(e) {
    // console.log('Adding license')
    // e.preventDefault()
    // const newLicenseId = licensesInputRef.current.value
    // const isDefault = licenses == null ? true : (licenses?.length === 0)

    // if (newLicenseId !== '') {
    //   const newLicense = {
    //     id: newLicenseId,
    //     default: isDefault
    //   }
    //   const prevState = licenses == null ? [] : [...licenses]
    //   setLicenses([...prevState, newLicense])
    // }
    // licensesInputRef.current.value = ''
  }

  function handleDefaultGlider(e) {
    // const defIdx = parseInt(e.target.id.split('-')[1])
    // const updateLicenses = licenses.map(updateLicence => {
    //   updateLicence.default = false
    //   return updateLicence
    // })
    // updateLicenses[defIdx].default = true
    // setLicenses(updateLicenses)
  }

  function handleRemoveGlider(e) {
    // e.preventDefault()
    // const removeIdx = parseInt(e.target.id.split('-')[1])
    // const reducedlicences = licenses.filter((_, idx) => {
    //   return idx !== removeIdx
    // })
    // if (reducedlicences.length > 0) {
    //   const defaultDeleted = reducedlicences.filter(license => {
    //     return license.default
    //   })
    //   if (defaultDeleted.length === 0) {
    //     reducedlicences[0].default = true
    //   }
    // }
    // setLicenses(reducedlicences)
  }

  function displayGliders() {
    let retval = <></>
    console.log(gliders)
    if (gliders != null) {
      retval = gliders.map((glider, index) => {

        const gliderName = glider.nickname ? `${glider.nickname} (${glider.type})` : `${glider.model} (${glider.type})`


        return (
          <Accordion.Item key={`acc-${index}`} eventKey={index}>
            <Accordion.Header className='sm'><h6>{gliderName}</h6></Accordion.Header>
            <Accordion.Body>
              <CardGroup>
                <Card style={{ maxWidth: '400px' }}>
                  <Card.Body className='py-0'>
                    <Form.Text muted>
                      Manufacturer:
                    </Form.Text>
                    <p>{glider.manufacturer}</p>
                  </Card.Body>
                </Card>
                <Card style={{ maxWidth: '400px' }}>
                  <Card.Body className='py-0'>
                    <Form.Text muted>
                      Model:
                    </Form.Text>
                    <p>{glider.model}</p>
                  </Card.Body>
                </Card>
              </CardGroup>
              <CardGroup>
                <Card style={{ maxWidth: '400px' }}>
                  <Card.Body className='py-0'>
                    <Form.Text muted>
                      Num. of Flights:
                    </Form.Text>
                    <p>{glider.flights}</p>
                  </Card.Body>
                </Card>

                <Card style={{ maxWidth: '400px' }}>
                  <Card.Body className='py-0'>
                    <Form.Text muted>
                      Image:
                    </Form.Text>
                    <p>{glider.imgLink}</p>
                  </Card.Body>
                </Card>
              </CardGroup>
              <CardGroup>
                <Card style={{ maxWidth: '400px' }}>
                  <Card.Body className='py-0'>
                    <Form.Text muted>
                      Purchased:
                    </Form.Text>
                    <p>{glider.purchased}</p>
                  </Card.Body>
                </Card>

                <Card style={{ maxWidth: '400px' }}>
                  <Card.Body className='py-0'>
                    <Form.Text muted>
                      Last check:
                    </Form.Text>
                    <p>{glider.lastCheck}</p>
                  </Card.Body>
                </Card>
              </CardGroup>
              <Card>
                <Card.Body>editStuff</Card.Body>
              </Card>
            </Accordion.Body>
          </Accordion.Item >
        )
      })
    }
    return retval
  }

  function handleOk() {
    const dialogData = {
      gliders: gliders
    }
    //updateMainData(mainData)
    setShow(false)
    props.onClose(dialogData)
  }

  function handleClose() {
    setShow(false)
    props.onClose()
  }

  return (
    <>
      <Modal
        size="lg"
        show={show}
        onHide={handleClose}
        backdrop='static'
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Your Wings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <Card.Title className='text-center'>Available wings</Card.Title>
            <Card.Body>
              <Row>
                <InputGroup className='mb-3'>
                  <Col>
                    <Accordion defaultActiveKey='-1'>
                      {displayGliders()}
                    </Accordion>
                  </Col>
                </InputGroup>
              </Row>
              <Row className='pt-2'>
                <Col sm className='text-end pt-2'>
                  <Form.Control className='mt-1' size='sm' type='text' placeholder='Manufacturer' />
                  <Form.Control className='mt-1' size='sm' type='text' placeholder='Manufacturer' />
                  <Form.Control className='mt-1' size='sm' type='text' placeholder='Manufacturer' />
                  <Form.Control className='mt-1' size='sm' type='text' placeholder='Manufacturer' />
                  <Form.Control className='mt-1' size='sm' type='text' placeholder='Manufacturer' />
                  <Form.Control className='mt-1' size='sm' type='text' placeholder='Manufacturer' />
                  <Form.Control className='mt-1' size='sm' type='text' placeholder='Manufacturer' />

                  <Button className='mt-1' variant='primary' onClick={handleAddGlider}>
                    Add
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Cancel
          </Button>
          <Button variant='primary' onClick={handleOk}>OK</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
