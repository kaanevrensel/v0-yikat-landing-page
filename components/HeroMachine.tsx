"use client"

import { forwardRef } from "react"
import { WashingMachine } from "@/components/WashingMachine"

export const HeroMachine = forwardRef<HTMLDivElement>(function HeroMachine(_, ref) {
  return (
    <div ref={ref} className="relative w-full" aria-hidden="true">
      <WashingMachine className="block h-auto w-full" />
    </div>
  )
})
