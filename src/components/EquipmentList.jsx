import React, { useRef, useState } from 'react'
import { Button, Form, Container, Col, Row, Card, FloatingLabel, Alert } from 'react-bootstrap'
import '../css/bitacora.css'

export default function EquipmentList() {
  const [equipmentList, setEquipmentList] = useState([])
  const [show, setShow] = useState(false);
  const manufacturerInputRef = useRef()
  const modelInputRef = useRef()
  const typeSelectRef = useRef()

  function handleAddEquipment(e) {
    e.preventDefault()
    const verifyEquipment = (typeSelectRef.current.value !== 'XX'
      && manufacturerInputRef.current.value.length > 0
      && modelInputRef.current.value.length > 0
    )
    setShow(!verifyEquipment) // To show the alert
    if(verifyEquipment){
      const newEquipment = {
        type: typeSelectRef.current.value,
        manufacturer: manufacturerInputRef.current.value,
        model: modelInputRef.current.value,
        default: true
      }
      setEquipmentList(prevState => ([...prevState, newEquipment]))
      typeSelectRef.current.value = 'XX'
      manufacturerInputRef.current.value = ''
      modelInputRef.current.value = ''
    }
  }

  function showEquipmentList() {
    
    const retval = equipmentList.map((equipment, index) => {
      const equipKey = `key-${index}`
      const defChekId = `defCheck-${index}`
      const remButKey = `remBut-${index}`
      return (
        <Container className='p-2' key={equipKey}>
          <Row>
            <Col sm className='equipment-table-header'>
              {equipment.type}
            </Col>
          </Row>
          <Row>
            <Col sm={4} className='equipment-table p-1'>Manuf.:</Col>
            <Col sm={5} className='equipment-table p-1'>{equipment.manufacturer}</Col>
            <Col sm={3} className='equipment-def text-center p-1'><Form.Check label='default' id={defChekId} /></Col>
          </Row>
          <Row>
            <Col sm={4} className='equipment-table p-1'>Model:</Col>
            <Col sm={5} className='equipment-table p-1'>{equipment.model}</Col>
            <Col sm={3} className='equipment-rem text-center p-1'><Button id={remButKey} variant='danger' size='sm' >remove</Button></Col>
          </Row>
        </Container>
      )
    })
    return retval
  }

  function alert() {
    const retVal = show ? (
      <Alert key='incomplete' variant='danger' onClose={() => setShow(false)} dismissible>
        Please complete your equipmente before adding
      </Alert>
    ) : (<></>)
    return retVal
  }

  return (
    <>
      <Card>
        <Card.Title className='text-center'>Equipment</Card.Title>
        <Card.Body>
          {alert()}
          {showEquipmentList()}
          <Form.Select ref={typeSelectRef}>
            <option value='XX'>Select your equipment type</option>
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
            <Button variant='primary' onClick={handleAddEquipment}>
              Add Equipment
            </Button>
          </div>
        </Card.Body>
      </Card>
    </>
  )
}
