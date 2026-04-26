"use client"

import { useState, useEffect, type CSSProperties } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"

export function PageLoader() {
  const [visible, setVisible] = useState(true)
  const [exiting, setExiting] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const t0 = Date.now()
    let timerId: number | undefined
    const startExit = () => setExiting(true)
    const onReady = () => {
      const remaining = Math.max(0, 500 - (Date.now() - t0))
      timerId = window.setTimeout(startExit, remaining)
    }
    if (document.readyState === "complete") {
      onReady()
    } else {
      window.addEventListener("load", onReady, { once: true })
    }
    return () => {
      window.removeEventListener("load", onReady)
      window.clearTimeout(timerId)
    }
  }, [])

  if (!visible) return null

  const overlayStyle: CSSProperties = {
    position: "fixed",
    inset: 0,
    zIndex: 9999,
    background: "#FAFAF7",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "14px",
    // Presentation only — never block hero interaction
    pointerEvents: "none",
  }

  const labelStyle: CSSProperties = {
    fontSize: "11px",
    color: "rgba(15,23,42,0.38)",
    letterSpacing: "0.04em",
    fontFamily: "inherit",
  }

  return (
    <AnimatePresence onExitComplete={() => setVisible(false)}>
      {!exiting && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeIn" }}
          style={overlayStyle}
        >
          <Porthole spin={prefersReducedMotion !== true} />
          {prefersReducedMotion !== true && (
            <span style={labelStyle}>Hazırlanıyor…</span>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const PORTHOLE_KEYFRAMES = `
  @keyframes porthole-tumble { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes porthole-orbit  { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`

function Porthole({ spin }: { spin: boolean }) {
  const wrapperStyle: CSSProperties = {
    position: "relative",
    width: 72,
    height: 72,
  }

  const orbitWrapperStyle: CSSProperties = {
    position: "absolute",
    inset: -10,
    borderRadius: "50%",
    animation: spin ? "porthole-orbit 2s linear infinite" : "none",
    pointerEvents: "none",
  }

  const orbitTrackStyle: CSSProperties = {
    position: "absolute",
    inset: 6,
    borderRadius: "50%",
    border: "1.5px solid rgba(39,152,255,0.18)",
  }

  const orbitDotStyle: CSSProperties = {
    position: "absolute",
    top: 6,
    left: "50%",
    transform: "translateX(-50%)",
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#2798ff",
    display: spin ? "block" : "none",
  }

  const bezelStyle: CSSProperties = {
    width: 72,
    height: 72,
    borderRadius: "50%",
    border: "6px solid #374151",
    background: "#dbeafe",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    boxShadow:
      "inset 0 2px 6px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.10)",
  }

  const tumblerGroupStyle: CSSProperties = {
    position: "relative",
    width: 44,
    height: 44,
    animation: spin ? "porthole-tumble 1.4s linear infinite" : "none",
  }

  return (
    <>
      <style>{PORTHOLE_KEYFRAMES}</style>
      <div style={wrapperStyle}>
        <div style={orbitWrapperStyle}>
          <div style={orbitTrackStyle} />
          <div style={orbitDotStyle} />
        </div>
        <div style={bezelStyle}>
          <div style={tumblerGroupStyle}>
            {[0, 120, 240].map((deg) => {
              const dotStyle: CSSProperties = {
                position: "absolute",
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.85)",
                top: "50%",
                left: "50%",
                transform: `rotate(${deg}deg) translateY(-16px) translate(-50%, -50%)`,
              }
              return <div key={deg} style={dotStyle} />
            })}
          </div>
        </div>
      </div>
    </>
  )
}
