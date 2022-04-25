import React, { useState, useContext, useEffect, useRef } from 'react'
import { Polyline, useMap } from 'react-leaflet'
import { getBounds, getCenterOfBounds } from 'geolib'
import { FlightContext } from '../../contexts/FlightContext'

export default function FlightTrack() {
  const [track, setTrack] = useState(null)
  const { eventBus } = useContext(FlightContext)
  const isMounted = useRef(false)
  const map = useMap()
  const pathOptions = { color: 'red', weight: 1.5 }
  const position = [47.44722, 8.62731]

  useEffect(() => {
    eventBus.on('newFile', () => {
      setTrack(null)
      map.panTo(position)
    })

    eventBus.on('igcParsed', (igc) => {
      if (igc) {
        const polyline = igc.fixes.map(fix => {
          return [fix.latitude, fix.longitude]
        })
        setTrack(<Polyline pathOptions={pathOptions} positions={polyline} />)
        const trackCenter = getCenterOfBounds(igc.fixes)
        const bounds = getBounds(igc.fixes)
        if (isMounted.current) {
          map.panTo([trackCenter.latitude, trackCenter.longitude])
          map.fitBounds([[bounds.maxLat, bounds.maxLng], [bounds.minLat, bounds.minLng]])
        }

      }
    })
    isMounted.current = true

    return (() => {
      isMounted.current = false
      eventBus.remove('newFile', () => { console.log('removed listener for newFile') })
      eventBus.remove('igcParsed', () => { console.log('removed listener for igcParsed') })
    })
  }, [])

  return (
    <>
      {track}
    </>

  )
}

