import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'

export default function ConfirmationDialog({ props }) {
  const [show, setShow] = useState(true)

  function handleCancel() {
    setShow(false)
    props.confirm(false)
  }

  function handleOk() {
    setShow(false)
    props.confirm(true)
  }

  return (
    <Modal
      show={show}
      onHide={handleCancel}
      backdrop='static'
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {props.text}
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={handleCancel}>Cancel</Button>
        <Button variant='danger' onClick={handleOk}>{props.action}</Button>
      </Modal.Footer>
    </Modal>
  )
}
