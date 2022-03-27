import React, { useContext, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Card, Image, Col } from 'react-bootstrap'
import { FlightContext } from '../../contexts/FlightContext'


export default function DropzoneFlight({ image }) {
  const { eventBus, loadIgcFile } = useContext(FlightContext)

  const onDrop = useCallback(acceptedFiles => {
    eventBus.dispatch('newFile', null)
    loadIgcFile(acceptedFiles[0])
  }, [])
  const {
    getRootProps,
    getInputProps
  } = useDropzone({
    onDrop,
    maxFiles: 1
  })

  return (
    <>
      <Col sm={4} style={{ alignSelf: 'center' }}>
        <p>If you have an IGC file, you can drop it on the left side, or click to select it. Bitacora will analyze the file and fill in all the possible fields in the form</p>
      </Col>
      <Col sm={4}>
        <Card>
          <Card.Title className='text-center'>Drop your IGC File here</Card.Title>
          <Card.Body className='text-center'>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {
                <Image src={image} />
              }
            </div>
          </Card.Body>
        </Card>
      </Col>
    </>
  )
}
