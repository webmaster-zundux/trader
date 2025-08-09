import * as d3 from 'd3'
import { memo, useCallback, useEffect, useMemo, useRef, type Dispatch, type MouseEvent, type RefObject, type SetStateAction } from 'react'
import styles from './PriceLinePlot.module.css'

function getAdjustmentValueOfMarginLeftAndBottom(
  svgElement: SVGSVGElement,
  axisSVGGElement: SVGGElement,
  maxEmptySpaceInSvgPx = 5
): { x: number, y: number } {
  const svgDomRect = svgElement.getBoundingClientRect()
  const axisDomRect = axisSVGGElement.getBoundingClientRect()
  const svgScreenCTM = svgElement.getScreenCTM()
  let svgPoint = svgElement.createSVGPoint()
  let svgPoint2 = svgElement.createSVGPoint()

  svgPoint.x = axisDomRect.x
  svgPoint.y = axisDomRect.y
  svgPoint2.x = svgDomRect.x
  svgPoint2.y = svgDomRect.y

  svgPoint = svgPoint.matrixTransform(svgScreenCTM?.inverse())
  svgPoint2 = svgPoint2.matrixTransform(svgScreenCTM?.inverse())
  let deltaX = svgPoint.x - svgPoint2.x
  let deltaY = svgPoint.y - svgPoint2.y

  if (deltaX <= maxEmptySpaceInSvgPx) {
    deltaX = 0
  }

  if (deltaY <= maxEmptySpaceInSvgPx) {
    deltaY = 0
  }

  return { x: deltaX, y: deltaY }
}

const PLOT_AXIS_TICK_LABEL_DEFAUL_FORMAT = d3.format(`.3~s`)
const PLOT_AXIS_TICK_LABEL_DELTA_FORMAT = d3.format(`.3~s`)
const PLOT_AXIS_TICK_LABEL_DELTA_FORMAT_PREFIX = `+`

function axisTickValueFormat(d: d3.NumberValue, isNoFormatingLimits = false) {
  const absValue = Math.abs(d.valueOf())

  if (
    !isNoFormatingLimits
    && (absValue > 0.001)
    && (absValue < 1000)
  ) {
    return `${+(d.valueOf()).toFixed(3)}`
  }

  return `${PLOT_AXIS_TICK_LABEL_DEFAUL_FORMAT(d)}`
}

function axisTickValueFormatAsDelta(d: d3.NumberValue, isNoFormatingLimits = false) {
  const absValue = Math.abs(d.valueOf())

  if (
    !isNoFormatingLimits
    && (absValue > 0.001)
    && (absValue < 1000)
  ) {
    return `${PLOT_AXIS_TICK_LABEL_DELTA_FORMAT_PREFIX}${+(d.valueOf()).toFixed(3)}`
  }

  return `${PLOT_AXIS_TICK_LABEL_DELTA_FORMAT_PREFIX}${PLOT_AXIS_TICK_LABEL_DELTA_FORMAT(d)}`
}

interface PriceLinePlotBodyProps {
  preparedData: [number, number][]
  width?: number
  height?: number
  marginTop?: number
  marginRight?: number
  marginBottom?: number
  marginLeft?: number
  innerTickLength?: number
  outerTickLength?: number
  xAxisTitleMarginBottom?: number
  yAxisTitleMarginTop?: number
  priceAxisName?: string
  markAxisName?: string
  pointRef?: RefObject<SVGGElement | null>
  setMarkValueOfSelectedPoint: Dispatch<SetStateAction<number | undefined>>
  adjustedMarginLeft: number
  setAdjustedMarginLeft: Dispatch<SetStateAction<number>>
  setIsAdjustedMarginLeft: Dispatch<SetStateAction<boolean>>
  adjustedMarginBottom: number
  setAdjustedMarginBottom: Dispatch<SetStateAction<number>>
  setIsAdjustedMarginBottom: Dispatch<SetStateAction<boolean>>
  xScale: d3.ScaleLinear<number, number, never>
  yScale: d3.ScaleLinear<number, number, never>
}
export const PriceLinePlotBody = memo(function PriceLinePlotBody({
  preparedData,
  width = 500,
  height = 250,
  marginTop = 18,
  marginRight = 0,
  marginBottom = 20,
  marginLeft = 60,
  innerTickLength = 6,
  outerTickLength = 12,
  xAxisTitleMarginBottom = -5,
  yAxisTitleMarginTop = 10,
  priceAxisName = 'price',
  markAxisName = 'quantity',
  pointRef,
  setMarkValueOfSelectedPoint,
  adjustedMarginLeft,
  setAdjustedMarginLeft,
  setIsAdjustedMarginLeft,
  adjustedMarginBottom,
  setAdjustedMarginBottom,
  setIsAdjustedMarginBottom,
  xScale,
  yScale,
}: PriceLinePlotBodyProps) {
  const line = useMemo(() => {
    return d3.line()
      .defined(d => Number.isFinite(d[0]) && Number.isFinite(d[1]))
      .x(d => xScale(d[1]))
      .y(d => yScale(d[0]))
  }, [xScale, yScale])

  const svgRef = useRef<SVGSVGElement>(null)
  const yAxisRef = useRef<SVGGElement>(null)
  const xAxisRef = useRef<SVGGElement>(null)

  useEffect(function drawXAxis() {
    const xAxisSVGGElement = xAxisRef.current

    if (!xAxisSVGGElement) {
      return
    }

    const xScaleLimits = xScale.domain()
    const isDeltaFormatNeeded = (xScale.ticks().length > 1) && (axisTickValueFormat(xScaleLimits[0]) === axisTickValueFormat(xScaleLimits[1]))

    d3.select(xAxisSVGGElement)
      .attr('class', styles.XAxis)
      .call(d3.axisBottom(xScale)
        .tickFormat(function formatTickForXAxis(d, index) {
          return (isDeltaFormatNeeded && (index !== 0)) ? axisTickValueFormatAsDelta(d.valueOf() - xScaleLimits[0]) : axisTickValueFormat(d)
        })
      )
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.cloned').remove())
      .call(g => g.selectAll('.tick text')
        .append('title')
        .text(d => `${d}`)
      )
      .call(g => g.selectAll('.tick line').clone()
        .attr('y1', -height + marginTop + adjustedMarginBottom)
        .attr('stroke-opacity', 0.1)
        .attr('stroke-dasharray', '0.25em')
        .attr('class', 'cloned')
      )
      .call(g => g.select(`.${styles.XAxisTitle}`).remove())
      .call(g => g.append('text')
        .attr('class', styles.XAxisTitle)
        .attr('x', width)
        .attr('y', adjustedMarginBottom + xAxisTitleMarginBottom)
        .attr('fill', 'currentColor')
        .attr('text-anchor', 'end')
        .text(`${markAxisName} ${isDeltaFormatNeeded ? 'Δ' : ''} →`))
  }, [xAxisRef, xScale, innerTickLength, outerTickLength, height, width, adjustedMarginBottom, marginTop, xAxisTitleMarginBottom, markAxisName])

  useEffect(function drawYAxisElements() {
    const yAxisSVGGElement = yAxisRef.current

    if (!yAxisSVGGElement) {
      return
    }

    const yScaleLimits = yScale.domain()
    const isDeltaFormatNeeded = (yScale.ticks().length > 1) && (axisTickValueFormat(yScaleLimits[0]) === axisTickValueFormat(yScaleLimits[1]))

    d3.select(yAxisSVGGElement)
      .attr('class', styles.YAxis)
      .call(d3.axisLeft(yScale)
        .tickFormat(function formatTickForYAxis(d, index) {
          return (isDeltaFormatNeeded && (index !== 0)) ? axisTickValueFormatAsDelta(d.valueOf() - yScaleLimits[0]) : axisTickValueFormat(d)
        })
      )
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.cloned').remove())
      .call(g => g.selectAll('.tick text')
        .append('title')
        .text(d => `${d}`)
      )
      .call(g => g.selectAll('.tick line').clone()
        .attr('x2', width - adjustedMarginLeft - marginRight)
        .attr('stroke-opacity', 0.1)
        .attr('stroke-dasharray', '0.25em')
        .attr('class', 'cloned')
      )
      .call(g => g.select(`.${styles.YAxisTitle}`).remove())
      .call(g => g.append('text')
        .attr('class', styles.YAxisTitle)
        .attr('x', 0)
        .attr('y', yAxisTitleMarginTop)
        .attr('fill', 'currentColor')
        .attr('text-anchor', 'end')
        .text(`↑ ${priceAxisName} ${isDeltaFormatNeeded ? 'Δ' : ''}`))
  }, [yAxisRef, yScale, innerTickLength, outerTickLength, adjustedMarginLeft, marginRight, width, yAxisTitleMarginTop, priceAxisName])

  useEffect(function adjustingLeftMarginEffect() {
    const svgElement = svgRef.current
    const yAxisElement = yAxisRef.current

    if (!svgElement || !yAxisElement) {
      return
    }

    const adjustmentValue = getAdjustmentValueOfMarginLeftAndBottom(svgElement, yAxisElement).x

    if (Math.abs(adjustmentValue) > 0) {
      setAdjustedMarginLeft(marginLeft - adjustmentValue)
    }

    setIsAdjustedMarginLeft(true)
  }, [svgRef, yAxisRef, setAdjustedMarginLeft, marginLeft, setIsAdjustedMarginLeft])

  useEffect(function adjustingMarginBottomEffect() {
    const svgElement = svgRef.current
    const xAxisElement = xAxisRef.current

    if (!svgElement || !xAxisElement) {
      return
    }

    const adjustmentValue = getAdjustmentValueOfMarginLeftAndBottom(svgElement, xAxisElement).y

    if (Math.abs(adjustmentValue) > 0) {
      setAdjustedMarginBottom(marginBottom + adjustmentValue)
    }

    setIsAdjustedMarginBottom(true)
  }, [svgRef, xAxisRef, setAdjustedMarginBottom, marginBottom, setIsAdjustedMarginBottom])

  const lineDataWithMissingPricesAtMarks = useMemo(() => {
    return line(preparedData.filter(d => Number.isFinite(d[0]) && Number.isFinite(d[1]))) || undefined
  }, [preparedData, line])

  const lineData = useMemo(() => {
    return line(preparedData) || undefined
  }, [preparedData, line])

  const bisect = useMemo(() => {
    return d3.bisector((d: [number, number]) => d[1]).center
  }, [])

  const handleMouseMove = useCallback(function handleMouseMove(event: MouseEvent<SVGSVGElement>) {
    if (!preparedData.length || !xScale || !yScale) {
      return
    }
    const indexPoint = bisect(preparedData, xScale.invert(d3.pointer(event)[0]))

    setMarkValueOfSelectedPoint(indexPoint)
  }, [bisect, preparedData, xScale, yScale, setMarkValueOfSelectedPoint])

  const handleMouseLeave = useCallback(function handleMouseLeave() {
    setMarkValueOfSelectedPoint(undefined)
  }, [setMarkValueOfSelectedPoint])

  return (
    <svg
      ref={svgRef}
      width="100%"
      viewBox={`0 0 ${width} ${height}`}
      style={{ maxWidth: '100%', height: 'intrinsic' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      role="application"
    >
      <g ref={xAxisRef} className={styles.XAxis} transform={`translate(0,${height - adjustedMarginBottom})`} />
      <g ref={yAxisRef} className={styles.YAxis} transform={`translate(${adjustedMarginLeft},0)`} />

      {!!lineDataWithMissingPricesAtMarks && (
        <path fill="none" stroke="gray" strokeWidth="1" d={lineDataWithMissingPricesAtMarks} className={styles.LineWithMissingData} />
      )}
      {!!lineData && (
        <path fill="none" stroke="lightgray" strokeWidth="1" d={lineData} className={styles.Line} />
      )}

      <g fill="white" stroke="currentColor" strokeWidth="1" className={styles.DotGroupOnLine}>
        {preparedData.map((dataValue, index) => (
          <circle key={index} cx={xScale(dataValue[1])} cy={yScale(dataValue[0])} r="1.5" className={styles.DotOnLine} />
        ))}
      </g>

      <g ref={pointRef} transform="translate(-1000,-1000)" className={styles.PointerDot}>
        <circle x="0" y="0" stroke="currentColor" strokeWidth="1" r="2.5" fill="currentColor" />
      </g>
    </svg>
  )
})
