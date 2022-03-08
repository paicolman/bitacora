import React, { useState, useContext } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FlightContext } from '../contexts/FlightContext'

export default function FlightChart() {
  const [data, setData] = useState(null)
  const { eventBus } = useContext(FlightContext)

  function mouseMove(e) {
    eventBus.dispatch("mouseOnChart", e)
  }
  eventBus.on('igcParsed', (igc) => {
    setData(igc.fixes)
  })

  return (
    <div id="map" style={{ width: '1200px', height: '400px', border: '3px solid black' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart

          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
          onMouseMove={mouseMove}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="pressureAltitude" stroke="#8884d8" fill="#8884d8" />
        </AreaChart>
      </ResponsiveContainer>
    </div>

  )
}
