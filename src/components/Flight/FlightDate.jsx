import React, { useContext, useState, useEffect } from 'react'
import EditFlightDate from './EditFlightDate'
import { FlightContext } from '../../contexts/FlightContext'


export default function FlightDate({ flightDate }) {
  const { setFlightDate } = useContext(FlightContext)
  const [openDlg, setOpenDlg] = useState(null)
  const [flyDate, setflyDate] = useState(0)
  const [dlgDate, setDlgDate] = useState(0)

  useEffect(() => {
    setflyDate(flightDate)
    setDlgDate(flightDate)
    setFlightDate(flightDate)
  }, [flightDate])

  useEffect(() => {
    setflyDate(dlgDate)
    console.log(dlgDate)
  }, [dlgDate])


  function handleClick() {
    const props = {
      flightDate: flightDate,
      onClose: onClose
    }
    setOpenDlg(<EditFlightDate props={props} />)
  }

  function onClose(dialogDate) {
    if (dialogDate) {
      setflyDate(dialogDate)
      setFlightDate(dialogDate)
    }
    setOpenDlg(null)
  }

  return (
    <>
      <h2 onClick={handleClick} className='clickable-title'>Date: {flyDate}</h2>
      {openDlg}
    </>

  )
}
