import React, { useState, useRef } from 'react'
import { Button, Card, Col, InputGroup, Modal, FloatingLabel, Form, Row } from 'react-bootstrap'

export default function EditLicenses({ props }) {
  const [show, setShow] = useState(true);
  const [licenses, setLicenses] = useState(props.licenses)
  const licensesInputRef = useRef()

  function handleAddLicence(e) {
    console.log('Adding license')
    e.preventDefault()
    const newLicenseId = licensesInputRef.current.value
    const isDefault = licenses == null ? true : (licenses?.length === 0)

    if (newLicenseId !== '') {
      const newLicense = {
        id: newLicenseId,
        default: isDefault
      }
      const prevState = licenses == null ? [] : [...licenses]
      setLicenses([...prevState, newLicense])
    }
    licensesInputRef.current.value = ''
  }

  function handleDefaultLicense(e) {
    const defIdx = parseInt(e.target.id.split('-')[1])
    const updateLicenses = licenses.map(updateLicence => {
      updateLicence.default = false
      return updateLicence
    })
    updateLicenses[defIdx].default = true
    setLicenses(updateLicenses)
  }

  function handleRemoveLicense(e) {
    e.preventDefault()
    const removeIdx = parseInt(e.target.id.split('-')[1])
    const reducedlicences = licenses.filter((_, idx) => {
      return idx !== removeIdx
    })
    if (reducedlicences.length > 0) {
      const defaultDeleted = reducedlicences.filter(license => {
        return license.default
      })
      if (defaultDeleted.length === 0) {
        reducedlicences[0].default = true
      }
    }
    setLicenses(reducedlicences)
  }

  function displayLicenses() {
    let retval = <></>
    if (licenses != null) {
      retval = licenses.map((license, index) => {
        const licenseKey = `license-${index}`
        const defChekId = `defCheck-${index}`
        const remButKey = `remBut-${index}`

        return (
          <Row className='license-list pt-1 pb-1' key={licenseKey}>
            <Col sm className='license text-center'>{license.id}</Col>
            <Col sm className='text-center'>
              <Form.Check inline label='default' id={defChekId} checked={license.default} onChange={handleDefaultLicense} />
            </Col>
            <Col sm className='text-center'>
              <Button id={remButKey} variant='danger' size='sm' onClick={handleRemoveLicense}>
                remove
              </Button>
            </Col>
          </Row>
        )
      })
    }
    return retval
  }

  function handleOk() {
    const dialogData = {
      licenses: licenses
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
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit Licenses</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Card>
          <Card.Title className='text-center'>Available Licenses</Card.Title>
          <Card.Body>
            <Row>
              <InputGroup className="mb-3">
                <Col>
                  {displayLicenses()}
                </Col>
              </InputGroup>
            </Row>
            <Row className='pt-2'>
              <Col sm={8}>
                <FloatingLabel controlId='floatingAddLicence' label='Add License' >
                  <Form.Control ref={licensesInputRef} type='text' />
                </FloatingLabel>
              </Col>
              <Col sm className='text-end pt-2'>
                <Button variant='primary' onClick={handleAddLicence}>
                  Add
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleOk}>OK</Button>
      </Modal.Footer>
    </Modal>
  )
}
