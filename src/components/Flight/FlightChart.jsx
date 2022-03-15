import React, { useState, useContext, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FlightContext } from '../../contexts/FlightContext'

export default function FlightChart({ chartType }) {
  const [data, setData] = useState(null)
  const { eventBus, diffData } = useContext(FlightContext)

  useEffect(() => {
    eventBus.on('igcParsed', (igc) => {
      if (chartType === 'pressureAltitude') {
        setData(igc.fixes)
      } else {
        setData(diffData)
      }
    })
  }, [])

  function mouseMove(e) {
    eventBus.dispatch('mouseOnChart', e)
  }



  return (
    <div id='map' style={{ width: '100%', height: '400px', border: '2px solid black' }}>
      <ResponsiveContainer width={'100%'} height={'100%'}>
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
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='time' />
          <YAxis />
          <Tooltip />
          <Area type='monotone' dataKey={chartType} stroke='#8884d8' fill='#8884d8' />
        </AreaChart>
      </ResponsiveContainer>

    </div>
  )
}
