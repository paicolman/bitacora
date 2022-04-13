import React from 'react'
import { Modal, Spinner } from 'react-bootstrap'

export default function PleaseWait() {
  return (
    <Modal
      show={true}
      size='sm'
      aria-labelledby='contained-modal-title-vcenter'
      centered
      backdrop='static'
      keyboard={false}
      animation={false}
    >
      <Modal.Body className='text-center'>
        <Spinner animation='border' variant='primary' />
        <h5>Please wait...</h5>
      </Modal.Body>

    </Modal>
  )
}
