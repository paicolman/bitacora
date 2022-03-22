import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Card, Image, Container } from 'react-bootstrap'
import AppHeader from '../AppHeader'
import ListIgcFiles from './ListIgcFiles'

export default function BulkUploadDropzone() {
  const [files, setFiles] = useState(null)
  const [image, setImage] = useState('assets/igc_nofile.png')

  const onDrop = useCallback(dumpedFiles => {
    const acceptedFiles = dumpedFiles.filter(file => {
      return file.name.endsWith('.igc')
    })
    const fileList = acceptedFiles.map(file => {
      return {
        import: false,
        file: file
      }
    })
    console.log(fileList)
    setImage('assets/has_igc.png')
    setFiles(fileList)
  }, [])

  const {
    getRootProps,
    getInputProps
  } = useDropzone({
    onDrop
  })

  return (
    <>
      <Container className='text-center'>
        <AppHeader props={{ home: true, logoutUser: true }} />
        <h2>Bulk upload</h2>
        <Card>
          <Card.Title className='text-center'>
            Drop your IGC Files here, or the directory tree containing them...<br />
            <small><small>(Please be aware: by clicking here you cannot select whole directories, but you can drag them from your finder / explorer)</small></small>
          </Card.Title>
          <Card.Body className='text-center'>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {
                <Image src={image} />
              }
            </div>
          </Card.Body>
        </Card>
        <ListIgcFiles files={files} />

      </Container>
    </>
  )
}
