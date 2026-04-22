"use client"

import { WashingMachine } from "@/components/WashingMachine"

export function HeroMachine() {
  return (
    <div className="relative w-full" aria-hidden="true">
      <WashingMachine className="block h-auto w-full" />
    </div>
  )
}
