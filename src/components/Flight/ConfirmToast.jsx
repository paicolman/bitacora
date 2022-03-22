import React, { useState } from 'react'
import { Toast, ToastContainer, Alert } from 'react-bootstrap'

export default function ConfirmToast({ props }) {
  const [show, setShow] = useState(true);

  const toggleShow = () => {
    setShow(false);
    props.closeToast()
  }

  return (
    <ToastContainer className="p-3" position='top-end' style={{ zIndex: '9999' }}>
      <Toast show={show} onClose={toggleShow} delay={8000} autohide>
        <Toast.Header className={props.type}>
          <strong className="me-auto">{props.header}</strong>
        </Toast.Header>
        <Toast.Body className={props.type}>
          <h6>{props.message}</h6>
          <small>{props.explanation}</small>
        </Toast.Body>
      </Toast>
    </ToastContainer>
  )
}
