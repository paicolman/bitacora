import React, { useState, useContext } from 'react'
import { Polyline, useMap } from 'react-leaflet'
import { getBounds, getCenterOfBounds } from 'geolib'
import { FlightContext } from '../contexts/FlightContext'
import { render } from '@testing-library/react'

export default function FlightTrack() {
  const [track, setTrack] = useState(null)
  const { eventBus, parseIgcFile } = useContext(FlightContext)
  const map = useMap()
  const pathOptions = { color: 'red', weight: 2 }

  eventBus.on('igcParsed', (igc) => {
    if (igc) {
      const trackCenter = getCenterOfBounds(igc.fixes)
      const bounds = getBounds(igc.fixes)
      console.log([bounds.minLat, bounds.minLng], [bounds.maxLat, bounds.maxLng])
      map.panTo([trackCenter.latitude, trackCenter.longitude])
      map.fitBounds([[bounds.maxLat, bounds.maxLng], [bounds.minLat, bounds.minLng]])
      const polyline = igc.fixes.map(fix => {
        return [fix.latitude, fix.longitude]
      })
      //eventBus.remove('igcParsed')
      setTrack(<Polyline pathOptions={pathOptions} positions={polyline} />)
    }
  })

  eventBus.on('newFile', () => {
    console.log('Resetting track')
    setTrack(null)
  })

  return (
    <>
      {track}
    </>

  )
}

