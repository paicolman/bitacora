
//*****************************************************************************************
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//! THIS FILE IS NOT USED ANYMORE. LEFT HERE FOR REFERENCE AT THE MOMENT, WILL DELETE LATER
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//*****************************************************************************************






import React, { useState, useRef, useContext } from 'react'
import { Button, Form, Col, Row, Card, FloatingLabel, InputGroup } from 'react-bootstrap'
import { ProfileDataContext } from '../../contexts/ProfileDataContext'

export function LicensesList() {

  const { updateLicenses } = useContext(ProfileDataContext)
  const [licenses, setLicenses] = useState([])
  const licensesInputRef = useRef()

  function handleAddLicence(e) {
    e.preventDefault()
    const newLicenseId = licensesInputRef.current.value
    const isDefault = (licenses.length === 0)

    if (newLicenseId !== '') {
      const newLicense = {
        id: newLicenseId,
        default: isDefault
      }
      const prevState = [...licenses]
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
    const retval = licenses.map((license, index) => {
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
    updateLicenses(licenses)
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
          <Col sm className='text-end pt-2'>
            <Button variant='primary' onClick={handleAddLicence}>
              Add
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
}

