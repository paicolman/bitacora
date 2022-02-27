import React, { useState, useRef } from 'react'
import { Button, Form, Col, Row, Card, FloatingLabel, InputGroup } from 'react-bootstrap'


export function LicensesList() {

  const [licenses, setLicenses] = useState([])
  const licensesInputRef = useRef()

  function handleAddLicence(e) {
    e.preventDefault()
    const newLicenseId = licensesInputRef.current.value
    let isDefault = (licenses.length === 0)

    if (newLicenseId !== '') {
      const newLicense = {
        id: newLicenseId,
        default: isDefault
      }
      setLicenses(prevState => ([...prevState, newLicense]))
    }
    licensesInputRef.current.value = ''
  }

  function handleDefaultLicense(e) {
    const defIdx = e.target.id.split('-')[1]
    const updateLicenses = [...licenses]
    updateLicenses.map(updateLicence => {
      return updateLicence.default = false
    })
    updateLicenses[defIdx].default = true
    setLicenses(updateLicenses)
  }

  function handleRemoveLicense(e) {
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
    let retval = []
    licenses.map((license, index) => {
      const licenseKey = `license-${index}`
      const defChekId = `defCheck-${index}`
      const remButKey = `remBut-${index}`

      retval.push(
        <Row className='pt-1'  key={licenseKey}>
          <Col sm>{license.id}</Col>
          <Col sm><Form.Check label='default' id={defChekId} checked={license.default} onChange={handleDefaultLicense}/></Col>
          <Col sm className='text-end'><Button id={remButKey} variant='primary' size='sm' onClick={handleRemoveLicense}>remove</Button></Col>
        </Row>
      )
      return license
    })
    return retval
  }

  return (
    <Card>
      <Card.Title className='text-center'>{' '}Licenses</Card.Title>
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
          <Col sm className='text-end'>
            <Button variant='primary' onClick={handleAddLicence}>
              Add
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
}

