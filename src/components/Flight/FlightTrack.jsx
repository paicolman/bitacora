import React, { useState, useContext, useEffect } from 'react'
import { Polyline, useMap } from 'react-leaflet'
import { getBounds, getCenterOfBounds } from 'geolib'
import { FlightContext } from '../../contexts/FlightContext'

export default function FlightTrack() {
  const [track, setTrack] = useState(null)
  const { eventBus } = useContext(FlightContext)
  const map = useMap()
  const pathOptions = { color: 'red', weight: 2 }
  const position = [47.44722, 8.62731]

  useEffect(() => {
    eventBus.on('newFile', () => {
      setTrack(null)
      map.panTo(position)
    })

    eventBus.on('igcParsed', (igc) => {
      if (igc) {
        const trackCenter = getCenterOfBounds(igc.fixes)
        const bounds = getBounds(igc.fixes)
        map.panTo([trackCenter.latitude, trackCenter.longitude])
        map.fitBounds([[bounds.maxLat, bounds.maxLng], [bounds.minLat, bounds.minLng]])
        const polyline = igc.fixes.map(fix => {
          return [fix.latitude, fix.longitude]
        })
        //eventBus.remove('igcParsed')
        setTrack(<Polyline pathOptions={pathOptions} positions={polyline} />)
      }
    })
  }, [])

  return (
    <>
      {track}
    </>

  )
}

