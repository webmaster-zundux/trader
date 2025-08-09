import * as d3 from 'd3'
import type { MouseEvent } from 'react'
import { useState } from 'react'
import { LinePlot } from './LinePlot'

const generateSinusoidalLineData = (): number[] =>
  d3
    .ticks(-2, 2, 200)
    .map(Math.sin)

export type PriceOnDate = {
  price: number
  date: number
}

export const MouseMovementDeltaExamplePlot = () => {
  const [data, setData] = useState<number[]>(generateSinusoidalLineData)

  function onMouseMove(event: MouseEvent) {
    const [x, y] = d3.pointer(event)

    setData(
      data
        .slice(-200)
        .concat(Math.atan2(x, y))
    )
  }

  return (
    <div onMouseMove={onMouseMove}>
      <LinePlot data={data} />
    </div>
  )
}
