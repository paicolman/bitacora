import React, { useRef, useState, useContext } from 'react'
import { ProfileDataContext } from '../contexts/ProfileDataContext'
import { Button, Form, Container, Col, Row, Card, FloatingLabel, Alert } from 'react-bootstrap'
import '../css/bitacora.css'

export default function GliderList() {

  const { updateGliders } = useContext(ProfileDataContext)
  const [gliderList, setGliderList] = useState([])
  const [show, setShow] = useState(false);
  const manufacturerInputRef = useRef()
  const modelInputRef = useRef()
  const typeSelectRef = useRef()

  function handleAddGlider(e) {
    e.preventDefault()
    const verifyGlider = (typeSelectRef.current.value !== 'XX'
      && manufacturerInputRef.current.value.length > 0
      && modelInputRef.current.value.length > 0
    )
    setShow(!verifyGlider) 
    setTimeout(() => {setShow(false)}, 5000)
    if (verifyGlider) {
      const isDefault = (gliderList.length === 0)
      const newGlider = {
        type: typeSelectRef.current.value,
        manufacturer: manufacturerInputRef.current.value,
        model: modelInputRef.current.value,
        default: isDefault
      }
      setGliderList(prevState => ([...prevState, newGlider]))
      typeSelectRef.current.value = 'XX'
      manufacturerInputRef.current.value = ''
      modelInputRef.current.value = ''
    }
  }

  function handleDefaultGlider(e) {
    const defIdx = parseInt(e.target.id.split('-')[1])
    const updateGliderList = gliderList.map(updateGlider => {
      updateGlider.default = false
      return updateGlider
    })
    updateGliderList[defIdx].default = true
    setGliderList(updateGliderList)
  }


  function handleRemoveGlider(e) {
    e.preventDefault()
    const removeIdx = parseInt(e.target.id.split('-')[1])
    const reducedGliders = gliderList.filter((_, idx) => {
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
    setGliderList(reducedGliders)
  }

  function showGliderList() {

    const retval = gliderList.map((glider, index) => {
      const equipKey = `key-${index}`
      const defChekId = `defCheck-${index}`
      const remButKey = `remBut-${index}`
      return (
        <Container className='p-2' key={equipKey}>
          <Row>
            <Col sm className='glider-table-header'>
              {glider.type}
            </Col>
          </Row>
          <Row>
            <Col sm={4} className='glider-table p-1'>Manuf.:</Col>
            <Col sm={5} className='glider-table p-1'>{glider.manufacturer}</Col>
            <Col sm={3} className='glider-def text-center p-1'>
              <Form.Check label='default' id={defChekId} checked={glider.default} onChange={handleDefaultGlider} />
            </Col>
          </Row>
          <Row>
            <Col sm={4} className='glider-table p-1'>Model:</Col>
            <Col sm={5} className='glider-table p-1'>{glider.model}</Col>
            <Col sm={3} className='glider-rem text-center p-1'>
              <Button id={remButKey} variant='danger' size='sm' onClick={handleRemoveGlider}>
                remove
              </Button>
            </Col>
          </Row>
        </Container>
      )
    })
    updateGliders(gliderList)
    return retval
  }

  function alert() {
    const retVal = show ? (
      <Alert key='incomplete' variant='danger' onClose={() => setShow(false)} dismissible>
        Please define your glider before adding...
      </Alert>
    ) : (<></>)
    return retVal
  }

  return (
      <Card>
        <Card.Title className='text-center'>Glider</Card.Title>
        <Card.Body>
          {alert()}
          {showGliderList()}
          <Form.Select ref={typeSelectRef}>
            <option value='XX'>Select your glider type</option>
            <option value='Hangglider'>Hangglider</option>
            <option value='Paraglider'>Paraglider</option>
          </Form.Select>
          <FloatingLabel controlId='manufacturer' label='Manufacturer' className='pt-2'>
            <Form.Control type='text' ref={manufacturerInputRef} placeholder='Manufacturer' />
          </FloatingLabel>
          <FloatingLabel controlId='model' label='Model' className='pt-2'>
            <Form.Control type='text' ref={modelInputRef} placeholder='Model' />
          </FloatingLabel>
          <div className='pt-2 text-center'>
            <Button variant='primary' onClick={handleAddGlider}>
              Add Glider
            </Button>
          </div>
        </Card.Body>
      </Card>
  )
}
