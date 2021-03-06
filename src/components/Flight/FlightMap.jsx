import React, { useContext, useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import { Accordion } from 'react-bootstrap'
import { FlightContext } from '../../contexts/FlightContext'
import FlightTrack from './FlightTrack'
import FlightChart from './FlightChart'

export default function FlightMap() {
  const { eventBus } = useContext(FlightContext)
  const position = [47.44722, 8.62731]
  const [markerPos, setMarkerPos] = useState([47.44722, 8.62731])
  //const map = useMap()

  useEffect(() => {
    eventBus.on('newFile', () => {
      setMarkerPos(position)
    })
    eventBus.on('mouseOnChart', (data) => {
      if (data?.activePayload) {
        const lat = data.activePayload[0].payload.latitude
        const lon = data.activePayload[0].payload.longitude
        setMarkerPos([lat, lon])
      }
    })
    return (() => {
      eventBus.remove('newFile', () => { console.log('removed listener for newFile') })
      eventBus.remove('mouseOnChart', () => { console.log('removed listener for mouseOnChart') })
    })
  }, [])

  return (
    <>
      <div id='map' style={{ width: '100%', height: '500px', border: '3px solid black' }}>
        <MapContainer center={position} zoom={13} scrollWheelZoom={false}>
          <TileLayer
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a>'"
          />
          <FlightTrack />
          <Marker position={markerPos}>

          </Marker>
        </MapContainer>
      </div>
      <Accordion>
        <Accordion.Item eventKey='1'>
          <Accordion.Header className='pt-0'>Altitude</Accordion.Header>
          <Accordion.Body>
            <FlightChart chartType='pressureAltitude' />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey='2'>
          <Accordion.Header>Vertical Speed</Accordion.Header>
          <Accordion.Body>
            <FlightChart chartType='verticalSpeed' />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey='3'>
          <Accordion.Header>Flight Speed</Accordion.Header>
          <Accordion.Body>
            <FlightChart chartType='speed' />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>


    </>
  )
}

// https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg
// https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-grau/default/current/3857/{z}/{x}/{y}.jpeg
// https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.swissimage/default/current/3857/{z}/{x}/{y}.jpeg
// https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.swissimage/default/current/3857/{z}/{x}/{y}.jpeg
// https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
// http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}
