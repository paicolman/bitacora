import React, { useState, useRef, useEffect, useContext } from 'react'
import { Button, Modal, FloatingLabel, Form } from 'react-bootstrap'
import { ProfileDataContext } from '../../contexts/ProfileDataContext'

export default function EditMainData({ props }) {

  const { updateMainData } = useContext(ProfileDataContext)
  const [show, setShow] = useState(true);
  const userNameRef = useRef()
  const flyingSinceRef = useRef()
  const handleClose = () => setShow(false);

  useEffect(() => {
    console.log(props)
    userNameRef.current.value = props.data.pilotName
    flyingSinceRef.current.value = props.data.flyingSince
  })

  function handleOk() {
    const mainData = {
      pilotName: userNameRef.current.value,
      flyingSince: flyingSinceRef.current.value
    }
    updateMainData(mainData, () => {
      setShow(false)
      props.closeDlg()
    })

  }

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Change Main Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FloatingLabel controlId='floatingName' label='Your Name' >
            <Form.Control type='text' ref={userNameRef} placeholder='Your Name' />
          </FloatingLabel>
          <FloatingLabel className='pt-2' controlId='floatingFlyingSince' label='Flying since...' >
            <Form.Control type='date' ref={flyingSinceRef} />
          </FloatingLabel>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleOk}>OK</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
