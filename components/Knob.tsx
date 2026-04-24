"use client"

import { type RefObject, useEffect, useState } from "react"
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from "framer-motion"

type Props = {
  containerRef: RefObject<HTMLDivElement | null>
}

const SVG_SIZE = 100
const VIEWBOX_W = 900
const VIEWBOX_H = 1100
const KNOB_LOCAL_X = 450
const KNOB_LOCAL_Y = 210

export function Knob({ containerRef }: Props) {
  const [rect, setRect] = useState<DOMRect | null>(null)
  const [isMeasured, setIsMeasured] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const update = () => {
      setRect(el.getBoundingClientRect())
      setIsMeasured(true)
    }

    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)

    return () => {
      ro.disconnect()
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [containerRef])

  const position = rect ? computePosition(rect) : { left: 0, top: 0, svgSize: SVG_SIZE }

  const prefersReducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const rawAngle = useTransform(scrollYProgress, [0, 1], [0, 1080])
  const smoothAngle = useSpring(rawAngle, { stiffness: 50, damping: 20 })
  const angle = prefersReducedMotion ? 0 : smoothAngle

  return (
    <svg
      aria-hidden="true"
      width={position.svgSize}
      height={position.svgSize}
      viewBox={`-${SVG_SIZE / 2} -${SVG_SIZE / 2} ${SVG_SIZE} ${SVG_SIZE}`}
      style={{
        position: "fixed",
        left: position.left,
        top: position.top,
        pointerEvents: "none",
        zIndex: 30,
        opacity: isMeasured ? 1 : 0,
      }}
    >
      <defs>
        <radialGradient id="knobBody" cx="40%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#5AA8FF" />
          <stop offset="40%" stopColor="#2E86F0" />
          <stop offset="80%" stopColor="#1A63C4" />
          <stop offset="100%" stopColor="#0D3F86" />
        </radialGradient>
        <radialGradient id="knobTop" cx="45%" cy="38%" r="70%">
          <stop offset="0%" stopColor="#6FB0FF" />
          <stop offset="55%" stopColor="#2E86F0" />
          <stop offset="100%" stopColor="#164F9E" />
        </radialGradient>
        <filter id="knobShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2.5" />
          <feOffset dx="0" dy="3" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.45" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#knobShadow)">
        <motion.g style={{ rotate: angle }}>
          <circle cx="0" cy="0" r="44" fill="#000" opacity="0.45" />
          <circle cx="0" cy="0" r="42" fill="url(#knobBody)" />
          <circle cx="0" cy="0" r="34" fill="url(#knobTop)" />
          <circle cx="0" cy="0" r="34" fill="none" stroke="#0A2D5C" strokeOpacity="0.35" strokeWidth="0.8" />
          <circle cx="0" cy="0" r="2.2" fill="#F4F6FA" opacity="0.95" />
          <rect x="-1.8" y="-30" width="3.6" height="11" rx="1.6" fill="#F4F6FA" opacity="0.9" />
        </motion.g>
      </g>
    </svg>
  )
}

function computePosition(rect: DOMRect) {
  const containerAspect = rect.width / rect.height
  const svgAspect = VIEWBOX_W / VIEWBOX_H
  const widthConstrained = containerAspect < svgAspect
  const scale = widthConstrained ? rect.width / VIEWBOX_W : rect.height / VIEWBOX_H
  const renderedW = VIEWBOX_W * scale
  const renderedH = VIEWBOX_H * scale
  const offsetX = (rect.width - renderedW) / 2
  const offsetY = (rect.height - renderedH) / 2
  const knobCenterX = rect.left + offsetX + KNOB_LOCAL_X * scale
  const knobCenterY = rect.top + offsetY + KNOB_LOCAL_Y * scale
  const svgSize = SVG_SIZE * scale
  return {
    left: knobCenterX - svgSize / 2,
    top: knobCenterY - svgSize / 2,
    svgSize,
  }
}
