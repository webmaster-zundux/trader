import * as d3 from 'd3'
import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { isFiniteNumber } from '../../../utils/isFiniteNumber'
import { cn } from '../../../utils/ui/ClassNames'
import { f3 } from '../../../utils/ui/toFixedFloatNumber'
import { FloatingTooltip } from '../../../components/FloatingTooltip'
import styles from './PriceLinePlot.module.css'
import { PriceLinePlotBody } from './PriceLinePlotBody'

interface PriceLinePlotProps {
  data: [number, number][]
  width?: number
  height?: number
  marginTop?: number
  marginRight?: number
  marginBottom?: number
  marginLeft?: number
  plotDomainPadding?: number
  innerTickLength?: number
  outerTickLength?: number
  xAxisTitleMarginBottom?: number
  yAxisTitleMarginTop?: number
  priceAxisName?: string
  markAxisName?: string
}
export const PriceLinePlot = memo(function PriceLinePlot({
  data,
  width = 500,
  height = 250,
  marginTop = 18,
  marginRight = 9,
  marginBottom = 20,
  marginLeft = 60,
  plotDomainPadding = 10,
  innerTickLength = 6,
  outerTickLength = 12,
  xAxisTitleMarginBottom = -5,
  yAxisTitleMarginTop = 10,
  priceAxisName = 'price',
  markAxisName = 'quantity',
}: PriceLinePlotProps) {
  const [adjustedMarginLeft, setAdjustedMarginLeft] = useState(marginLeft)
  const [adjustedMarginBottom, setAdjustedMarginBottom] = useState(marginBottom)
  const [isAdjustedMarginLeft, setIsAdjustedMarginLeft] = useState(false)
  const [isAdjustedMarginBottom, setIsAdjustedMarginBottom] = useState(false)
  const isVisiblePlot = isAdjustedMarginLeft && isAdjustedMarginBottom

  const preparedData = useMemo(() => {
    return (
      data.filter(d => Number.isFinite(d[1])) as [number, number][]
    ).sort((a, b) => a[1] - b[1])
  }, [data])

  const xDomainLimits = useMemo(() => {
    let limits = d3.extent<[number, number], number>(preparedData, d => d[1])

    if (
      (limits[0] === undefined)
      || (limits[1] === undefined)
    ) {
      limits = [0, 1]
    }
    return limits
  }, [preparedData])

  const yDomainLimits = useMemo(() => {
    let limits = d3.extent<[number, number], number>(preparedData, d => d[0])

    if (
      (limits[0] === undefined)
      || (limits[1] === undefined)
    ) {
      limits = [0, 1]
    }
    return limits
  }, [preparedData])

  const xScale = useMemo(() => {
    return d3.scaleLinear()
      .domain(xDomainLimits).nice()
      .rangeRound([adjustedMarginLeft + plotDomainPadding, width - marginRight - plotDomainPadding])
  }, [xDomainLimits, adjustedMarginLeft, marginRight, plotDomainPadding, width])

  const yScale = useMemo(() => {
    return d3.scaleLinear()
      .domain(yDomainLimits).nice()
      .rangeRound([height - adjustedMarginBottom - plotDomainPadding, marginTop + plotDomainPadding])
  }, [yDomainLimits, marginTop, adjustedMarginBottom, plotDomainPadding, height])

  const pointRef = useRef<SVGGElement>(null)
  const [markValueOfSelectedPoint, setMarkValueOfSelectedPoint] = useState<number | undefined>(undefined)
  const plotContainerRef = useRef<HTMLDivElement>(null)
  const [domRectTargetPosition, setDomRectTargetPosition] = useState<{ x: number, y: number } | undefined>(undefined)

  const tooltipPriceValue: number | undefined = useMemo(() => {
    return markValueOfSelectedPoint !== undefined ? preparedData[markValueOfSelectedPoint]?.[0] : undefined
  }, [preparedData, markValueOfSelectedPoint])

  const tooltipMarkValue: number | undefined = useMemo(() => {
    return markValueOfSelectedPoint !== undefined ? preparedData[markValueOfSelectedPoint]?.[1] : undefined
  }, [preparedData, markValueOfSelectedPoint])

  useEffect(function updateDomTargetPointPositionEffect() {
    const svgPoint = pointRef.current

    if (!svgPoint) {
      setDomRectTargetPosition(undefined)
      return
    }

    if (markValueOfSelectedPoint === undefined) {
      setDomRectTargetPosition(undefined)
      return
    }

    const dataRecord = preparedData[markValueOfSelectedPoint]

    if (!dataRecord) {
      setDomRectTargetPosition(undefined)
      return
    }

    const [priceValue, markValue] = dataRecord
    const position = {
      x: (isFiniteNumber(markValue) ? f3(xScale(markValue)) : 0),
      y: (isFiniteNumber(priceValue) ? f3(yScale(priceValue)) : 0),
    }

    svgPoint.setAttribute(`transform`, `translate(${position.x},${position.y})`)

    const plotContainerElement = plotContainerRef.current

    if (!plotContainerElement) {
      setDomRectTargetPosition(undefined)
      return
    }
    const plotContainerElementRect = plotContainerElement.getBoundingClientRect()
    const pointElementRect = svgPoint.getBoundingClientRect()

    setDomRectTargetPosition({
      x: (pointElementRect.x + pointElementRect.width / 2) - plotContainerElementRect.x,
      y: (pointElementRect.y + pointElementRect.height / 2) - plotContainerElementRect.y,
    })

    return function updateDomTargetPointPositionEffectCleanup() {
      svgPoint.setAttribute(`transform`, `translate(-1000,-1000)`)
    }
  }, [markValueOfSelectedPoint, preparedData, xScale, yScale])

  return (
    <div
      ref={plotContainerRef}
      className={cn([
        styles.PlotContainer,
        isVisiblePlot && styles.IsVisible,
      ])}
    >
      <PriceLinePlotBody
        preparedData={preparedData}
        width={width}
        height={height}
        marginTop={marginTop}
        marginRight={marginRight}
        marginBottom={marginBottom}
        marginLeft={marginLeft}
        innerTickLength={innerTickLength}
        outerTickLength={outerTickLength}
        xAxisTitleMarginBottom={xAxisTitleMarginBottom}
        yAxisTitleMarginTop={yAxisTitleMarginTop}
        priceAxisName={priceAxisName}
        markAxisName={markAxisName}

        pointRef={pointRef}
        setMarkValueOfSelectedPoint={setMarkValueOfSelectedPoint}
        adjustedMarginLeft={adjustedMarginLeft}
        setAdjustedMarginLeft={setAdjustedMarginLeft}
        setIsAdjustedMarginLeft={setIsAdjustedMarginLeft}
        adjustedMarginBottom={adjustedMarginBottom}
        setAdjustedMarginBottom={setAdjustedMarginBottom}
        setIsAdjustedMarginBottom={setIsAdjustedMarginBottom}
        xScale={xScale}
        yScale={yScale}
      />

      {(tooltipMarkValue !== undefined) && (
        <FloatingTooltip
          elementWithTargetPointRef={plotContainerRef}
          targetPoint={domRectTargetPosition}
        >
          <div className={styles.PriceLineTooltipContent}>
            <span>Price:</span>
            <span>{tooltipPriceValue}</span>
            <span>Quantity:</span>
            <span>{tooltipMarkValue}</span>
          </div>
        </FloatingTooltip>
      )}
    </div>
  )
})
