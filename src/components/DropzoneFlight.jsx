import React, { useContext, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Card } from 'react-bootstrap'
import { FlightContext } from '../contexts/FlightContext'


export default function DropzoneFlight() {
  const { eventBus, loadIgcFile } = useContext(FlightContext)

  const onDrop = useCallback(acceptedFiles => {
    eventBus.dispatch('newFile', null)
    loadIgcFile(acceptedFiles[0])
  }, [])
  const {
    getRootProps,
    getInputProps,
    isDragActive
  } = useDropzone({
    onDrop,
    maxFiles: 1
  })

  return (
    <Card>
      <Card.Title>Drop your IGC File here...</Card.Title>
      <Card.Body>
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          {
            isDragActive ?
              <p>Drop the files here ...</p> :
              <p>Drag 'n' drop some files here, or click to select files</p>
          }
        </div>
      </Card.Body>
    </Card>
  )
}
