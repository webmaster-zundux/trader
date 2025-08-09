import type { PropsWithChildren } from 'react'
import type React from 'react'
import { memo, useEffect, useRef, useState } from 'react'
import { cn } from '../utils/ui/ClassNames'
import styles from './FloatingTooltip.module.css'

type SimpleRect = {
  x: number
  y: number
  width: number
  height: number
}
function calculateLabelPositionInsideContainer(
  containerRect: SimpleRect,
  labelRect: SimpleRect,
  pointer: SimpleRect
): { x: number, y: number } {
  let labelX = labelRect.x
  let labelY = labelRect.y

  if (labelX < containerRect.x) {
    labelX = containerRect.x
    if (labelY < containerRect.y) {
      labelY = containerRect.y
    } else if ((labelY + labelRect.height) > (containerRect.y + containerRect.height)) {
      labelY = (containerRect.y + containerRect.height) - labelRect.height
    }
  } else if ((labelX >= containerRect.x) && ((labelX + labelRect.width) <= (containerRect.x + containerRect.width))) {
    if (labelY < containerRect.y) {
      labelY = containerRect.y
    } else if ((labelY + labelRect.height) > (containerRect.y + containerRect.height)) {
      labelY = (containerRect.y + containerRect.height) - labelRect.height
    }
  } else if ((labelX + labelRect.width) > (containerRect.x + containerRect.width)) {
    labelX = (containerRect.x + containerRect.width) - labelRect.width
    if (labelY < containerRect.y) {
      labelY = containerRect.y
    } else if ((labelY + labelRect.height) > (containerRect.y + containerRect.height)) {
      labelY = (containerRect.y + containerRect.height) - labelRect.height
    }
  }

  if (
    (labelX >= ((containerRect.x + containerRect.width) - labelRect.width))
    && (pointer.x >= ((containerRect.x + containerRect.width) - labelRect.width))
  ) {
    labelX = labelX - labelRect.width
  }

  if (
    (labelY >= ((containerRect.y + containerRect.height) - labelRect.height))
    && (pointer.y >= ((containerRect.y + containerRect.height) - labelRect.height))
  ) {
    labelY = labelY - labelRect.height
  }

  return {
    x: labelX,
    y: labelY,
  }
}

interface FloatingTooltipProps extends PropsWithChildren {
  targetPoint?: { x: number, y: number } | undefined
  showTargetPointMarker?: boolean
  elementWithTargetPointRef: React.RefObject<SVGSVGElement | HTMLElement | null>
}
export const FloatingTooltip = memo(function FloatingTooltip({
  targetPoint,
  showTargetPointMarker = false,
  elementWithTargetPointRef,
  children,
}: FloatingTooltipProps) {
  const labelRef = useRef<HTMLDivElement>(null)
  const labelContentRef = useRef<HTMLDivElement>(null)
  const [pointerPosition, setPointerPosition] = useState<{ x: number, y: number } | undefined>(undefined)
  const [labelPosition, setLabelPosition] = useState<{ x: number, y: number } | undefined>(undefined)
  const [labelContentPosition, setLabelContentPosition] = useState<{ x: number, y: number } | undefined>(undefined)
  const [labelContentPositionOffset, setLabelContentPositionOffset] = useState<{ xOffset: number, yOffset: number } | undefined>(undefined)

  useEffect(function updateLabelContentOffsetEffect() {
    const labelElement = labelRef?.current
    const labelContentElement = labelContentRef.current

    if (
      !labelElement
      || !labelContentElement
    ) {
      setLabelContentPositionOffset(undefined)
      return
    }

    const elementWithTargetPointDomRect = labelElement.getBoundingClientRect()
    const labelContentRect = labelContentElement.getBoundingClientRect()

    setLabelContentPositionOffset({
      xOffset: labelContentRect.x - elementWithTargetPointDomRect.x,
      yOffset: labelContentRect.y - elementWithTargetPointDomRect.y,
    })
  }, [elementWithTargetPointRef, labelContentRef, setLabelContentPositionOffset])

  useEffect(function updatePositionOfPointerAndLabelEffect() {
    function resetPositions() {
      setPointerPosition(undefined)
      setLabelPosition(undefined)
      setLabelContentPosition(undefined)
    }

    const elementWithTargetPoint = elementWithTargetPointRef?.current

    if (
      !elementWithTargetPoint
      || !targetPoint
    ) {
      resetPositions()
      return
    }

    const elementWithTargetPointDomRect = elementWithTargetPoint.getBoundingClientRect()
    const pointerX = Math.min(Math.max(0, targetPoint.x), elementWithTargetPointDomRect.width)
    const pointerY = Math.min(Math.max(0, targetPoint.y), elementWithTargetPointDomRect.height)

    setPointerPosition({ x: pointerX, y: pointerY })

    const labelElement = labelRef.current

    if (!labelElement) {
      resetPositions()
      return
    }

    const containerRect = elementWithTargetPointDomRect
    const labelRect = labelElement.getBoundingClientRect()
    const labelX = pointerX + elementWithTargetPointDomRect.x
    const labelY = pointerY + elementWithTargetPointDomRect.y
    const absolutePositionOfLabelRect = {
      x: labelX,
      y: labelY,
      width: labelRect.width,
      height: labelRect.height,
    }
    const absolutePositionOfPointRect = {
      x: pointerX + elementWithTargetPointDomRect.x,
      y: pointerY + elementWithTargetPointDomRect.y,
      width: 1,
      height: 1,
    }

    const limitedPositionOfLabel = calculateLabelPositionInsideContainer(containerRect, absolutePositionOfLabelRect, absolutePositionOfPointRect)

    const newLabelPosition = {
      x: limitedPositionOfLabel.x - elementWithTargetPointDomRect.x,
      y: limitedPositionOfLabel.y - elementWithTargetPointDomRect.y,
    }

    setLabelPosition(newLabelPosition)

    if (!labelContentPositionOffset) {
      return
    }
    setLabelContentPosition({
      x: newLabelPosition.x + labelContentPositionOffset.xOffset,
      y: newLabelPosition.y + labelContentPositionOffset.yOffset,
    })

    return function updatePositionOfPointerAndLabelEffectCleanup() {
      resetPositions()
    }
  }, [targetPoint, elementWithTargetPointRef, setPointerPosition, setLabelPosition, setLabelContentPosition, labelRef, labelContentPositionOffset])

  return (
    <div className={styles.PointAnchorContainer}>

      {(!!pointerPosition && !!labelContentPosition && (
        <svg
          className={styles.PointingLine}
          id="line-between-target-point-and-tooltip"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            x1={pointerPosition.x}
            y1={pointerPosition.y}
            x2={labelContentPosition.x}
            y2={labelContentPosition.y}
          />
        </svg>
      ))}

      {(showTargetPointMarker && !!pointerPosition) && (
        <div
          className={styles.PointAnchor}
          style={{
            left: pointerPosition?.x,
            top: pointerPosition?.y,
          }}
        >
        </div>
      )}

      <div
        ref={labelRef}
        className={cn([styles.LabelAnchor])}
        style={{
          left: labelPosition?.x || -1000,
          top: labelPosition?.y || -1000,
        }}
      >
        <div className={styles.FloatingLabel}>
          <div ref={labelContentRef} className={styles.FloatingLabelContent}>
            {children}
          </div>
        </div>
      </div>

    </div>
  )
})
