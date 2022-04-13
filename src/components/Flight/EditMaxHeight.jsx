import React, { useState, useRef, useEffect } from 'react'
import { Button, Modal, FloatingLabel, Form } from 'react-bootstrap'

export default function EditMaxHeight({ props }) {
  const maxHeightRef = useRef()
  const [show, setShow] = useState(true);

  useEffect(() => {
    maxHeightRef.current.value = props.maxHeight
  }, [])


  function handleOk() {
    setShow(false)
    props.onClose(maxHeightRef.current.value)
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
        <Modal.Title>Edit Max. Height</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FloatingLabel label='Max Height:' >
          <Form.Control ref={maxHeightRef} type='number' placeholder='Max Height' />
        </FloatingLabel>
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
