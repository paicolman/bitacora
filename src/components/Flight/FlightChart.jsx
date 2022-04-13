import React, { useState, useContext, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FlightContext } from '../../contexts/FlightContext'

export default function FlightChart({ chartType }) {
  const [data, setData] = useState(null)
  const { eventBus, diffData } = useContext(FlightContext)

  useEffect(() => {
    eventBus.on('newFile', () => {
      setData(null)
    })

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

  function started() {
    console.log('STARTED')
  }

  function stopped() {
    console.log('STOPPED')
  }

  return (
    <div id='map' style={{ width: '100%', height: '200px', border: '2px solid black' }}>
      <ResponsiveContainer width={'100%'} height={200}>
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
          <Area type='monotone' dataKey={chartType} stroke='#8884d8' fill='#8884d8' onAnimationStart={started} onAnimationEnd={stopped} />
        </AreaChart>
      </ResponsiveContainer>

    </div>
  )
}
