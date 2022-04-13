import React, { useContext, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Card, Image, OverlayTrigger, Tooltip } from 'react-bootstrap'
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

  const renderTooltip = (props) => (
    <Tooltip id='button-tooltip' {...props}>
      If you have an IGC file, you can drop it here, or click to select it. Bitacora will analyze the file and fill in all the possible fields in the form
    </Tooltip>
  )

  return (
    <>
      <OverlayTrigger placement='bottom' delay={{ show: 250, hide: 400 }} overlay={renderTooltip}>
        <Card className='mt-2 mb-2'>
          <Card.Title className='text-center' alt='sjdhfgsjfhg'>Drop your IGC File here</Card.Title>
          <Card.Body className='text-center'>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {
                <Image src={image} />
              }
            </div>
          </Card.Body>
        </Card>
      </OverlayTrigger>

    </>
  )
}
