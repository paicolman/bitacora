import React, { useState, useRef } from 'react'
import { Accordion, Alert, Button, Card, Col, Container, InputGroup, Modal, Form, Row, CardGroup } from 'react-bootstrap'

export default function EditGliders({ props }) {
  const [show, setShow] = useState(true);
  const [showAlert, setAlert] = useState(false);
  const [gliders, setGliders] = useState(props.gliders)

  const typeSelectRef = useRef()
  const manufacturerRef = useRef()
  const modelRef = useRef()
  const nicknameRef = useRef()
  const numFlightsRef = useRef()
  const purchasedRef = useRef()
  const lastCheckRef = useRef()
  const addWingRef = useRef()

  let editIndex = 0

  function handleAddGlider(e) {
    e.preventDefault()
    const verifyGlider = (typeSelectRef.current.value !== 'XX'
      && manufacturerRef.current.value.length > 0
      && modelRef.current.value.length > 0
    )
    if (!verifyGlider) {
      setAlert(true)
      setTimeout(() => { setAlert(false) }, 5000)
    }
    if (verifyGlider) {
      const isDefault = (gliders.length === 0)
      const newGlider = {
        default: isDefault,
        lastCheck: lastCheckRef.current.value,
        manufacturer: manufacturerRef.current.value,
        model: modelRef.current.value,
        nickname: nicknameRef.current.value,
        numFlights: numFlightsRef.current.value,
        purchased: purchasedRef.current.value,
        type: typeSelectRef.current.value,
      }
      const addWing = addWingRef.current.innerHTML === 'Add Wing'
      if (addWing) {
        setGliders(prevState => ([...prevState, newGlider]))
      } else {
        const editedGliders = [...gliders]
        editedGliders[editIndex] = newGlider
        setGliders(editedGliders)
        addWingRef.current.innerHTML = 'Add Wing'
      }
      typeSelectRef.current.value = 'XX'
      manufacturerRef.current.value = ''
      modelRef.current.value = ''
      nicknameRef.current.value = ''
      numFlightsRef.current.value = ''
      purchasedRef.current.value = ''
      lastCheckRef.current.value = ''
    }
  }

  function handleDefault(e) {
    const defIdx = parseInt(e.target.id.split('-')[1])
    const updateGliderList = gliders.map(updateGlider => {
      updateGlider.default = false
      return updateGlider
    })
    updateGliderList[defIdx].default = true
    setGliders(updateGliderList)
  }

  function handleRemove(e) {
    e.preventDefault()
    const removeIdx = parseInt(e.target.id.split('-')[1])
    const reducedGliders = gliders.filter((_, idx) => {
      return idx !== removeIdx
    })
    if (reducedGliders.length > 0) {
      const defaultDeleted = reducedGliders.filter(glider => {
        return glider.default
      })
      if (defaultDeleted.length === 0) {
        reducedGliders[0].default = true
      }
    }
    setGliders(reducedGliders)
  }

  function handleEdit(e) {
    e.preventDefault()
    editIndex = parseInt(e.target.id.split('-')[1])
    const gliderToEdit = gliders.filter((_, idx) => {
      return idx === editIndex
    })[0]
    typeSelectRef.current.value = gliderToEdit.type
    manufacturerRef.current.value = gliderToEdit.manufacturer
    modelRef.current.value = gliderToEdit.model
    nicknameRef.current.value = gliderToEdit.nickname
    numFlightsRef.current.value = gliderToEdit.numFlights
    purchasedRef.current.value = gliderToEdit.purchased
    lastCheckRef.current.value = gliderToEdit.lastCheck
    addWingRef.current.innerHTML = 'Update Wing'
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
                    <p>{glider.numFlights}</p>
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
                      Purchased on:
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
                <Card.Body className='p-1'>
                  <Row>
                    <Col sm className='text-center'>
                      <Form.Check
                        id={`default-${index}`}
                        style={{ display: 'inline-flex' }}
                        type="switch"
                        label='Main Wing'
                        checked={glider.default}
                        onChange={handleDefault}
                      />
                    </Col>
                    <Col sm className='text-center'>
                      <Button
                        id={`edit-${index}`}
                        className='mt-1'
                        variant='primary'
                        onClick={handleEdit}>
                        Edit
                      </Button>
                    </Col>
                    <Col sm className='text-center'>
                      <Button
                        id={`remove-${index}`}
                        className='mt-1'
                        variant='danger'
                        onClick={handleRemove}>
                        Remove
                      </Button>
                    </Col>
                  </Row>

                </Card.Body>
              </Card>
            </Accordion.Body>
          </Accordion.Item>
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

  function alert() {
    const retVal = showAlert ? (
      <Alert key='incomplete' variant='danger' onClose={() => setShow(false)} dismissible>
        You need at least a type, a manufacturer and a model
      </Alert>
    ) : (<></>)
    return retVal
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
          {alert()}
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
                <Col sm>
                  <Form>
                    <Form.Select ref={typeSelectRef}>
                      <option value='XX'>Select your wing type</option>
                      <option value='Hangglider'>Hangglider</option>
                      <option value='Paraglider'>Paraglider</option>
                    </Form.Select>
                    <Form.Group as={Row} className='pt-1'>
                      <Col sm={2}>
                        <Form.Label className='small'>Manufacturer:</Form.Label>
                      </Col>
                      <Col sm={10}>
                        <Form.Control size='sm' type='text' ref={manufacturerRef} />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className='pt-1'>
                      <Col sm={2}>
                        <Form.Label className='small'>Model:</Form.Label>
                      </Col>
                      <Col sm={10}>
                        <Form.Control size='sm' type='text' ref={modelRef} />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className='pt-1'>
                      <Col sm={2}>
                        <Form.Label className='small'>Nickname:</Form.Label>
                      </Col>
                      <Col sm={10}>
                        <Form.Control size='sm' type='text' ref={nicknameRef} />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className='pt-1'>
                      <Col sm={2}>
                        <Form.Label className='small'>Nr. of flights:</Form.Label>
                      </Col>
                      <Col sm={10}>
                        <Form.Control size='sm' type='number' ref={numFlightsRef} />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className='pt-1'>
                      <Col sm={2}>
                        <Form.Label className='small'>Image:</Form.Label>
                      </Col>
                      <Col sm={10}>
                        <Form.Control size='sm' type='file' />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className='pt-1'>
                      <Col sm={2}>
                        <Form.Label className='small'>Purchased on:</Form.Label>
                      </Col>
                      <Col sm={4}>
                        <Form.Control size='sm' type='date' ref={purchasedRef} />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className='pt-1'>
                      <Col sm={2}>
                        <Form.Label className='small'>Last check on:</Form.Label>
                      </Col>
                      <Col sm={4}>
                        <Form.Control size='sm' type='date' ref={lastCheckRef} />
                      </Col>
                    </Form.Group>
                  </Form>
                  <Container className='text-center'>
                    <Button ref={addWingRef} className='mt-1' variant='primary' onClick={handleAddGlider}>
                      Add Wing
                    </Button>
                  </Container>


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
