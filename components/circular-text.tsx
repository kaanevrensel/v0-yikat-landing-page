"use client"

// reactbits.dev CircularText deseninden ilhamla temiz-oda yazım — SVG textPath ile dönen damga.
// Dönüş saf CSS (animate-spin + inline süre): compositor'da çalışır, display:none'da tarayıcı
// durdurur, motion-safe ile reduced-motion'da kapanır.
import { useId } from "react"

type CircularTextProps = { text: string; spinDuration?: number; className?: string }

export default function CircularText({ text, spinDuration = 30, className }: CircularTextProps) {
  const id = useId()
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      style={{ animationDuration: `${spinDuration}s` }}
      className={`motion-safe:animate-spin ${className ?? ""}`}
    >
      <defs>
        <path id={id} d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
      </defs>
      <text className="fill-current uppercase">
        <textPath href={`#${id}`}>{text}</textPath>
      </text>
    </svg>
  )
}
