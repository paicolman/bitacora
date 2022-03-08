import React, { useContext, useState } from 'react'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import { FlightContext } from '../contexts/FlightContext'
import FlightTrack from './FlightTrack'
import FlightChart from './FlightChart'

export default function FlightMap() {
  const { parseIgcFile, eventBus } = useContext(FlightContext)
  const position = [47.44722, 8.62731]
  const [markerPos, setMarkerPos] = useState([47.44722, 8.62731])
  const [igcObject, setIgcObject] = useState(null)
  //const map = useMap()

  eventBus.on('mouseOnChart', (data) => {
    if (data.activePayload) {
      const lat = data.activePayload[0].payload.latitude
      const lon = data.activePayload[0].payload.longitude
      setMarkerPos([lat, lon])
    }

  })


  return (
    <>
      <div id="map" style={{ width: '1200px', height: '800px', border: '3px solid black' }}>
        <MapContainer center={position} zoom={13} scrollWheelZoom={false}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <FlightTrack />
          <Marker position={markerPos}>

          </Marker>
        </MapContainer>
      </div>
      <FlightChart />
    </>
  )
}

// https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg
// https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-grau/default/current/3857/{z}/{x}/{y}.jpeg
// https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.swissimage/default/current/3857/{z}/{x}/{y}.jpeg
// https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.swissimage/default/current/3857/{z}/{x}/{y}.jpeg
// https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
// http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}
