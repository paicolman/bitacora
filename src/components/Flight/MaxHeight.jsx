import React, { useState, useEffect, useContext } from 'react'
import EditMaxHeight from './EditMaxHeight'
import { FlightContext } from '../../contexts/FlightContext'

export default function MaxHeight({ maxHeight }) {
  const { setMaxHeight } = useContext(FlightContext)
  const [openDlg, setOpenDlg] = useState(null)
  const [height, setHeight] = useState(0)
  const [dlgHeight, setDlgHeight] = useState(0)

  useEffect(() => {
    setHeight(maxHeight)
    setDlgHeight(maxHeight)
    setMaxHeight(maxHeight)
  }, [maxHeight])

  useEffect(() => {
    setHeight(dlgHeight)
    setMaxHeight(dlgHeight)
  }, [dlgHeight])


  function handleClick() {
    const props = {
      maxHeight: maxHeight,
      onClose: onClose
    }
    setOpenDlg(<EditMaxHeight props={props} />)
  }

  function onClose(dialogHeight) {
    if (dialogHeight) {
      setHeight(dialogHeight)
      setMaxHeight(dialogHeight)
    }
    setOpenDlg(null)
  }

  return (
    <>
      <h2 onClick={handleClick} className='clickable-title'>{`Max Height: ${height} m`}</h2>
      {openDlg}
    </>

  )
}
