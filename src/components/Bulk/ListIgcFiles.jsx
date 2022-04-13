import React, { useState, useEffect, useRef } from 'react'
import { Button, Row, Col, Form, ListGroup } from 'react-bootstrap'
import BulkUpload from './BulkUpload'


export default function ListIgcFiles({ files }) {
  const [displayFiles, setDisplayFiles] = useState('No Files available yet...')
  const [openDlg, setOpenDlg] = useState(null)
  const uploadButton = useRef()

  useEffect(() => {
    listFiles()
  }, [files])

  function handleSelect(e) {
    const index = parseInt(e.target.id.split('_')[1])
    files[0].onClose = handleCloseDlg // ref put in the first element of files object for simplicity
    files[index].import = e.target.checked
    listFiles()
    anySelected()
  }

  function handleSelectAll(e) {
    files[0].onClose = handleCloseDlg // ref put in the first element of files object for simplicity
    files = files.map(item => {
      item.import = e.target.checked
      return item
    })
    listFiles()
    anySelected()
  }

  function anySelected() {
    let anySelected = false
    if (files) {
      anySelected = files.some(file => {
        return file.import
      })
    }
    if (uploadButton) {
      uploadButton.current.disabled = !anySelected
    }
  }

  function handleOpenDlg() {
    setOpenDlg(<BulkUpload files={files} />)
  }

  function handleCloseDlg() {
    setOpenDlg(null)
  }

  function listFiles() {
    if (!files) { return ('No Files available yet...') }
    const fileSelectList = []
    const listOfFiles = files.map((file, idx) => {
      fileSelectList.push({
        name: file.name,
        checked: false
      })
      return (
        <ListGroup.Item key={`item-${idx}`}>
          <Row>
            <Col sm={10}>
              {file.file.name}
            </Col>
            <Col sm={2}>
              <Form.Check id={`box_${idx}`} type='checkbox' checked={file.import} onChange={handleSelect} />
            </Col>
          </Row>
        </ListGroup.Item>
      )
    })
    const retVal = (
      <>
        <p>We found the following IGC files available for upload. Please select the ones you want to upload and press the 'upload' button down below.</p>
        <div className='d-flex justify-content-center'>
          <div className='pt-3 w-100' style={{ maxWidth: '800px' }}>
            <ListGroup>
              <ListGroup.Item key={`header-item`}>
                <Row>
                  <Col sm={10}>
                    <b>File Name</b>
                  </Col>
                  <Col sm={2}>
                    <Form.Check id={'hdrItem'} type='checkbox' onChange={handleSelectAll} />
                  </Col>
                </Row>
              </ListGroup.Item>
              {listOfFiles}
            </ListGroup>
          </div>
        </div>
        <Row className='pt-2 d-flex justify-content-center'>
          <Button ref={uploadButton} variant='primary' size='lg' style={{ maxWidth: '200px' }} onClick={handleOpenDlg}>Upload</Button>
        </Row>
      </>
    )
    setDisplayFiles(retVal)
  }

  return (
    <>
      <div>{displayFiles}</div>
      {openDlg}
    </>
  )
}
