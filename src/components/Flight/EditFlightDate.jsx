import React, { useState, useRef, useEffect } from 'react'
import { Button, Modal, FloatingLabel, Form } from 'react-bootstrap'

export default function EditFlightDate({ props }) {
  const flightDateRef = useRef()
  const [show, setShow] = useState(true);

  useEffect(() => {
    flightDateRef.current.value = props.flightDate
  }, [])


  function handleOk() {
    setShow(false)
    props.onClose(flightDateRef.current.value)
  }

  function handleClose() {
    setShow(false)
    props.onClose()
  }
  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop='static'
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit Flight Date</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Control ref={flightDateRef} type='date' />
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={handleClose}>
          Cancel
        </Button>
        <Button variant='primary' onClick={handleOk}>OK</Button>
      </Modal.Footer>
    </Modal>
  )
}
