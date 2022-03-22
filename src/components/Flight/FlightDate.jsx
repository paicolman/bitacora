import React, { useContext, useState, useEffect } from 'react'
import EditFlightDate from './EditFlightDate'
import { FlightContext } from '../../contexts/FlightContext'


export default function FlightDate({ date }) {
  const { setFlightDate } = useContext(FlightContext)
  const [openDlg, setOpenDlg] = useState(null)
  const [flyDate, setflyDate] = useState(0)
  const [dlgDate, setDlgDate] = useState(0)

  useEffect(() => {
    setflyDate(date)
    setDlgDate(date)
    setFlightDate(date)
  }, [date])

  useEffect(() => {
    setflyDate(dlgDate)
    console.log(dlgDate)
  }, [dlgDate])


  function handleClick() {
    const props = {
      flightDate: date,
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
