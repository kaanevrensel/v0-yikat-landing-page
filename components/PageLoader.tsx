"use client"

import { useState, useEffect, type CSSProperties } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"

export function PageLoader() {
  const [visible, setVisible] = useState(true)
  const [exiting, setExiting] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const t0 = Date.now()
    const startExit = () => setExiting(true)
    const onReady = () => {
      const remaining = Math.max(0, 500 - (Date.now() - t0))
      window.setTimeout(startExit, remaining)
    }
    if (document.readyState === "complete") {
      onReady()
    } else {
      window.addEventListener("load", onReady, { once: true })
    }
    return () => window.removeEventListener("load", onReady)
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
          {/* Porthole spinner added in next commit */}
          {prefersReducedMotion === true ? null : null}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
