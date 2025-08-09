import * as d3 from 'd3'
import { useEffect, useRef } from 'react'

interface LinePlotProps {
  data: number[]
  width?: number
  height?: number
  marginTop?: number
  marginRight?: number
  marginBottom?: number
  marginLeft?: number
}

export function LinePlot({
  data,
  width = 500,
  height = 250,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 20,
  marginLeft = 30,
}: LinePlotProps) {
  const x = d3.scaleLinear([0, data.length - 1], [marginLeft, width - marginRight])
  const y = d3.scaleLinear(d3.extent(data) as number[], [height - marginBottom, marginTop])
  const line = d3.line((dataValue, index) => x(index), y)
  const gxRef = useRef<SVGGElement>(null)
  const gyRef = useRef<SVGGElement>(null)
  const lineData = line(data) || undefined

  useEffect(() => {
    const xAxis = gxRef.current

    if (!xAxis) {
      return
    }

    d3.select(xAxis).call(d3.axisBottom(x))
  }, [gxRef, x])

  useEffect(() => {
    const yAxis = gyRef.current

    if (!yAxis) {
      return
    }

    d3.select(yAxis).call(d3.axisLeft(y))
  }, [gyRef, y])

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`}>
      <g ref={gxRef} transform={`translate(0,${height - marginBottom})`} />
      <g ref={gyRef} transform={`translate(${marginLeft},0)`} />
      <path fill="none" stroke="currentColor" strokeWidth="1.5" d={lineData} />
      <g fill="white" stroke="currentColor" strokeWidth="1.5">
        {data.map((dataValue, index) => (
          <circle key={index} cx={x(index)} cy={y(dataValue)} r="2.5" />
        ))}
      </g>
    </svg>
  )
}
