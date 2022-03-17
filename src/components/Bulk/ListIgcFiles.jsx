import React, { useState, useEffect } from 'react'
import { Button, Row, Col, Form, ListGroup } from 'react-bootstrap'
import BulkUpload from './BulkUpload'


export default function ListIgcFiles({ files }) {
  const [displayFiles, setDisplayFiles] = useState('No Files available yet...')
  const [openDlg, setOpenDlg] = useState(null)

  useEffect(() => {
    listFiles()
  }, [files])

  function handleSelect(e) {
    const index = parseInt(e.target.id.split('_')[1])
    files[index].import = e.target.checked
    listFiles()
  }

  function handleSelectAll(e) {
    files = files.map(item => {
      item.import = e.target.checked
      return item
    })
    listFiles()
  }


  function handleOpenDlg() {
    setOpenDlg(<BulkUpload files={files} />)
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
        <p>We found the following IGC files available for upload. Please select the ones you want to upload and press the "upload" button down below.</p>
        <div className='d-flex justify-content-center'>
          <div className="pt-3 w-100" style={{ maxWidth: "800px" }}>
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
          <Button variant='primary' size='lg' style={{ maxWidth: '200px' }} onClick={handleOpenDlg}>Upload</Button>
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