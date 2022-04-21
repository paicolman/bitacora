import React, { useState, useContext, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush } from 'recharts';
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
        decimate(igc.fixes, chartType)
      } else {
        decimate(diffData, chartType)
      }
    })
  }, [])

  function decimate(flightData, chartType) {
    console.log(chartType)
    const dataPointsToDisplay = 800
    const reductionRate = Math.floor(flightData.length / dataPointsToDisplay)
    let decimated = []
    if (reductionRate === 0) {
      console.log(flightData)
      setData(flightData)
      return
    }
    for (let counter = 0; counter < flightData.length - reductionRate; counter += reductionRate) {
      const value = {}
      value[chartType] = flightData[counter][chartType]
      value['latitude'] = flightData[counter]['latitude']
      value['longitude'] = flightData[counter]['longitude']
      value['time'] = flightData[counter]['time']
      for (let i = 1; i < reductionRate; i++) {
        value[chartType] += flightData[counter + i][chartType]

      }
      value[chartType] = (value[chartType] / reductionRate).toFixed(2)
      decimated.push(value)
    }
    console.log(decimated)
    setData(decimated)
  }

  function mouseMove(e) {
    eventBus.dispatch('mouseOnChart', e)
  }

  return (
    <div id='map' style={{ width: '100%', height: '200px', border: '1px solid black' }}>
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
          <Tooltip />
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='time' interval='preserveStartEnd' minTickGap={30} />
          <YAxis />
          <Tooltip />
          <Area type='monotone' dataKey={chartType} stroke='#8884d8' fill='#8884d8' />
          {/* <Brush dataKey={chartType} height={20} stroke="#8884d8" /> */}
        </AreaChart>
      </ResponsiveContainer>

    </div>
  )
}
