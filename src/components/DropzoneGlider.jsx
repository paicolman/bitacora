import React, { useState, useCallback } from 'react'
import Image from 'react-bootstrap/Image'
import { useDropzone } from 'react-dropzone'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import Resizer from 'react-image-file-resizer'


export default function DropzoneGlider({ gliderId }) {
  const [gliderpic, setGliderpic] = useState(null)

  function resizeFile(file, maxX, maxY) {
    return new Promise((resolve) => {
      Resizer.imageFileResizer(file, maxX, maxY, "JPEG", 80, 0, (uri) => {
        resolve(uri);
      },
        "base64"
      )
    })
  }

  const dataURIToBlob = (dataURI) => {
    const splitDataURI = dataURI.split(",");
    const byteString =
      splitDataURI[0].indexOf("base64") >= 0
        ? atob(splitDataURI[1])
        : decodeURI(splitDataURI[1]);
    const mimeString = splitDataURI[0].split(":")[1].split(";")[0];
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
    return new Blob([ia], { type: mimeString });
  }

  const onDrop = useCallback(acceptedFiles => {
    //Make a little and a medium verion of the file...
    resizeFile(acceptedFiles[0], 200, 200).then(thumbnailBytes => {
      resizeFile(acceptedFiles[0], 1200, 1200).then(gliderPicBytes => {
        const thumbnail = dataURIToBlob(thumbnailBytes)
        const gliderPic = dataURIToBlob(gliderPicBytes)

        const storage = getStorage()
        const thumbRef = ref(storage, `${gliderId}/images/thumbnail`)
        uploadBytes(thumbRef, thumbnail).then((snapshot) => {
          const picRef = ref(storage, `${gliderId}/images/gliderpic`)
          uploadBytes(picRef, gliderPic).then((snapshot) => {
            setGliderpic(null)
          })

        })
      })
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
      const storageRef = ref(storage, `${gliderId}/images/thumbnail`)
      getDownloadURL(storageRef, `${gliderId}/images/thumbnail`).then((url) => {
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
        <div style={{ maxHeight: '200px', maxWidth: '100%' }}>
          <OverlayTrigger key='top' placement='top' overlay={
            <Tooltip id={`tooltip-top`}>
              drag'n drop or <br /> click to replace
            </Tooltip>
          }>
            <Image src={gliderpic} style={{ maxWidth: '100%', maxHeight: '200px' }} />
          </OverlayTrigger>
        </div>

      }
    </div>
  )
}
