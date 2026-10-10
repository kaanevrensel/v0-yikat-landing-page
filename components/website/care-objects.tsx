"use client";

import { useId } from "react";
import { CareStar } from "./brand-art";

export type CareObjectKind = "camera" | "parcel" | "tag";

/** Small mechanical scenes, each drawn for its role rather than a shared icon box. */
export function CareObject({ kind, className = "" }: { kind: CareObjectKind; className?: string }) {
  const id = useId();
  return <svg viewBox="0 0 300 300" className={`care-object care-object-${kind} ${className}`} fill="none" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id={`${id}-blue`} x1="63" y1="45" x2="238" y2="250" gradientUnits="userSpaceOnUse"><stop stopColor="#68caff"/><stop offset=".42" stopColor="#299aff"/><stop offset="1" stopColor="#125fae"/></linearGradient>
      <linearGradient id={`${id}-white`} x1="64" y1="63" x2="221" y2="261" gradientUnits="userSpaceOnUse"><stop stopColor="#fff"/><stop offset="1" stopColor="#dceefa"/></linearGradient>
      <linearGradient id={`${id}-lens`} x1="116" y1="105" x2="181" y2="179" gradientUnits="userSpaceOnUse"><stop stopColor="#0c355e"/><stop offset=".5" stopColor="#258ed6"/><stop offset=".53" stopColor="#125685"/><stop offset="1" stopColor="#092d51"/></linearGradient>
    </defs>
    {kind === "camera" && <>
      <ellipse cx="147" cy="267" rx="86" ry="9" fill="#174f7c12"/>
      <g className="camera-print">
        <rect x="101" y="157" width="111" height="113" rx="5" fill="#b8d9ed"/>
        <rect x="97" y="153" width="111" height="113" rx="5" fill="white" stroke="#cee5f3"/>
        <rect x="105" y="162" width="95" height="78" rx="2" fill="#e3f4ff"/>
        <path d="m114 214 22-32 24 12 9 16 22 8c8 3 7 13-1 13h-71c-9 0-11-9-5-17Z" fill="white" stroke="#80b6dc" strokeWidth="2"/>
        <path d="m139 195 11 4m-15 3 12 4m-23 17h63" stroke="#269aff" strokeWidth="3" strokeLinecap="round"/>
        <path d="M132 251h43" stroke="#c9e1f1" strokeWidth="3" strokeLinecap="round"/>
      </g>
      <g transform="rotate(-8 145 137)">
        <rect x="53" y="85" width="197" height="126" rx="29" fill="#11588f"/>
        <path d="M77 77h141c17 0 30 13 30 30v59c0 20-16 36-36 36H83c-23 0-37-13-37-34v-57c0-20 11-34 30-34Z" fill={`url(#${id}-blue)`} stroke="#2a87c5" strokeWidth="1.5"/>
        <path d="M56 107c0-14 9-23 24-23h127" stroke="#b4e6ff" strokeWidth="2" strokeLinecap="round"/>
        <rect x="73" y="67" width="37" height="13" rx="6" fill="#e7f5ff" stroke="#accfe8"/>
        <rect x="68" y="98" width="32" height="20" rx="5" fill="#f0faff" stroke="#1777b9"/>
        <path d="M77 102v12m8-12v12m8-12v12" stroke="#c3deed"/>
        <circle cx="158" cy="140" r="49" fill="#125d98"/>
        <circle cx="153" cy="136" r="46" fill={`url(#${id}-white)`} stroke="#fff" strokeWidth="2"/>
        <circle cx="153" cy="136" r="37" fill="#8fb6d1"/>
        <circle cx="153" cy="136" r="31" fill={`url(#${id}-lens)`}/>
        <circle cx="153" cy="136" r="20" stroke="#83caff" strokeOpacity=".6" strokeWidth="2"/>
        <path d="M133 124a23 23 0 0 1 22-12" stroke="#cff3ff" strokeWidth="6" strokeLinecap="round"/>
        <circle cx="166" cy="151" r="5" fill="#8fe5ff" opacity=".7"/>
        <circle cx="222" cy="112" r="5" fill="#e8faff"/>
        <path d="M213 151h18m-18 7h18m-18 7h18" stroke="#0f6aad" strokeWidth="3" strokeLinecap="round"/>
        <path d="M96 194h112" stroke="#124b78" strokeWidth="5" strokeLinecap="round"/>
      </g>
    </>}
    {kind === "parcel" && <>
      <ellipse cx="153" cy="274" rx="105" ry="11" fill="#174f7c13"/>
      <path d="M79 94c-4-64 136-66 139 0" stroke="#104e83" strokeWidth="19"/>
      <path d="M79 92c-2-56 136-61 139 0" stroke="#57b8f6" strokeWidth="11"/>
      <path d="m56 111 26-37 137-8 34 40-1 135c0 18-24 24-45 27l-119-4c-25-1-39-11-38-29Z" fill={`url(#${id}-blue)`} stroke="#176cb3" strokeWidth="2"/>
      <path d="m56 111 141 7 56-12-34-40-137 8Z" fill="#82d1fb"/>
      <path d="m197 119 56-13-1 135c-1 16-18 25-52 26Z" fill="#166cba"/>
      <path d="m68 126 116 5 3 114-120-4Z" stroke="#94d6ff" strokeDasharray="3 5" opacity=".7"/>
      <path d="m80 79 131-6 26 29-44 10-128-6Z" fill="#e9f6fd"/>
      <path d="m104 97 47-16 44 9 24 14-26 8-89-5Z" fill="white"/>
      <path d="m70 113 120 7 54-12" stroke="#0b4f83" strokeWidth="4" strokeLinecap="round"/>
      <CareStar x={130} y={185} radius={37}/>
      <g className="parcel-tag">
        <path d="M221 115c11 15 5 23 0 32" stroke="#d7f1ff" strokeWidth="2"/>
        <path d="m212 138 24 5 8 17-10 47-34-8 10-48Z" fill={`url(#${id}-white)`} stroke="#adcee4"/>
        <circle cx="220" cy="151" r="3" fill="#2383c3"/>
        <path d="m211 171 20 4m-22 3 20 5m-22 3 20 4" stroke="#6d9fbf" strokeWidth="2"/>
      </g>
    </>}
    {kind === "tag" && <>
      <ellipse cx="149" cy="277" rx="77" ry="9" fill="#174f7c13"/>
      <path d="M158 17c-62-29-73 50-9 65 60 14 59-62 15-60-31 0-23 44-12 61" stroke="#176bbb" strokeWidth="9"/>
      <path d="M158 17c-62-29-73 50-9 65 60 14 59-62 15-60" stroke="#78c9ff" strokeWidth="3"/>
      <g className="hanging-tag">
        <path d="m103 76 90 1 38 47-8 132c-1 8-8 14-17 13l-118-7c-9 0-15-8-14-16l8-127Z" fill="#a9d2ee"/>
        <path d="m99 69 90 1 38 47-8 132c-1 8-8 14-17 13l-118-7c-9 0-15-8-14-16l8-127Z" fill={`url(#${id}-white)`} stroke="#fff" strokeWidth="2"/>
        <circle cx="146" cy="98" r="9" fill="#c1deef" stroke="#81b3d2" strokeWidth="2"/>
        <circle cx="146" cy="98" r="5" fill="#226ea4"/>
        <CareStar x={146} y={168} radius={40} fill="#269aff"/>
        <path d="m84 222 122 7" stroke="#a6cce4" strokeWidth="2" strokeDasharray="2 6"/>
        <path d="m118 242 55 3" stroke="#80b4d7" strokeWidth="4" strokeLinecap="round"/>
      </g>
    </>}
  </svg>;
}
