import React, { useState, useCallback } from 'react'
import Image from 'react-bootstrap/Image'
import { useDropzone } from 'react-dropzone'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'


export default function DropzoneGlider({ gliderId }) {
  const [gliderpic, setGliderpic] = useState(null)

  const onDrop = useCallback(acceptedFiles => {
    console.log(gliderId, acceptedFiles)
    const storage = getStorage()
    const storageRef = ref(storage, `${gliderId}/images/gliderpic`)
    uploadBytes(storageRef, acceptedFiles[0]).then((snapshot) => {
      setGliderpic(null)
    })
  }, [])

  const {
    getRootProps,
    getInputProps
  } = useDropzone({
    onDrop,
    accept: 'image/*',
    maxFiles: 1
  })

  function getPicUrl() {
    if (!gliderpic) {
      const storage = getStorage()
      const storageRef = ref(storage, `${gliderId}/images/gliderpic`)
      getDownloadURL(storageRef, `${gliderId}/images/gliderpic`).then((url) => {
        setGliderpic(url)
      }, () => {
        setGliderpic('/assets/dropzone_1.jpg')
      })
    }
  }
  getPicUrl()


  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {
        <OverlayTrigger key='top' placement='top' overlay={
          <Tooltip id={`tooltip-top`}>
            drag'n drop or <br /> click to replace
          </Tooltip>
        }>
          <Image src={gliderpic} style={{ maxHeight: '130px' }} />
        </OverlayTrigger>

      }
    </div>
  )
}
