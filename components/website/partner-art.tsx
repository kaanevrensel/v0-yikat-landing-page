"use client";

import { useId } from "react";
import { CareStar } from "./brand-art";

export function PartnerArt({ kind }: { kind: "region" | "board" | "rhythm" }) {
  const id = useId();
  return (
    <svg className={`partner-art partner-art-${kind}`} viewBox="0 0 360 270" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-blue`} x1="55" y1="45" x2="280" y2="225" gradientUnits="userSpaceOnUse"><stop stopColor="#67cbff" /><stop offset=".5" stopColor="#269aff" /><stop offset="1" stopColor="#1767b8" /></linearGradient>
        <linearGradient id={`${id}-paper`} x1="60" y1="60" x2="285" y2="250" gradientUnits="userSpaceOnUse"><stop stopColor="#fff" /><stop offset="1" stopColor="#e4f3fd" /></linearGradient>
      </defs>
      {kind === "region" && <>
        <ellipse cx="178" cy="238" rx="138" ry="12" fill="#0a477a18" />
        <g transform="rotate(-7 180 155)">
          <path d="m37 92 91-25 95 25 99-25v151l-99 25-95-25-91 25Z" fill={`url(#${id}-paper)`} stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
          <path d="m128 67 95 25v151l-95-25Z" fill="#d9edfc" />
          <path d="m45 126 76-22 106 33 85-29M44 191l68-19 106 23 94-28M82 90l2 135m76-142 4 140m104-136 5 139" stroke="white" strokeWidth="8" />
          <path d="m52 207 48-13c13-4 13-39 26-44s34 17 49 9l57-37c16-10 25 1 30 10" stroke="#269aff" strokeWidth="4" strokeLinecap="round" strokeDasharray="1 10" />
          <circle cx="52" cy="207" r="8" fill="#269aff" stroke="#fff" strokeWidth="4" />
          <path d="m57 113 22-5v16l-22 6Zm44 60 14-4v21l-14 4Zm142 26 32-9v18l-32 9Z" fill="#badbf0" />
        </g>
        <ellipse cx="256" cy="142" rx="22" ry="7" fill="#165b9d24" />
        <path d="M291 80c0-21-15-35-35-35s-35 14-35 35c0 22 35 58 35 58s35-36 35-58Z" fill={`url(#${id}-blue)`} stroke="#1882d0" strokeWidth="1.5" />
        <path d="M230 77c2-13 11-23 24-24" stroke="#c0eeff" strokeWidth="2" strokeLinecap="round" />
        <CareStar x={256} y={81} radius={20} />
      </>}
      {kind === "board" && <>
        <g transform="rotate(-9 145 145)"><rect x="39" y="41" width="208" height="176" rx="19" fill="#b3dbf6" /><rect x="45" y="36" width="208" height="176" rx="19" fill="#ebf7ff" stroke="#bbdcf4" /></g>
        <g transform="rotate(4 197 146)">
          <rect x="91" y="50" width="231" height="178" rx="18" fill="#a4d0ee" />
          <rect x="86" y="44" width="231" height="178" rx="18" fill={`url(#${id}-paper)`} stroke="#bcdcf1" />
          <path d="M105 74h44" stroke="#269aff" strokeWidth="6" strokeLinecap="round" /><circle cx="293" cy="74" r="5" fill="#b5dff8" />
          <path d="M105 95h190" stroke="#daebf7" />
          <rect x="106" y="111" width="53" height="91" rx="7" fill="#e5f3fd" /><rect x="174" y="111" width="53" height="91" rx="7" fill="#e5f3fd" /><rect x="242" y="111" width="53" height="91" rx="7" fill="#e5f3fd" />
          <rect x="176" y="118" width="49" height="60" rx="8" fill={`url(#${id}-blue)`} />
          <CareStar x={201} y={143} radius={13} />
          <path d="M187 165h27" stroke="#b7e6ff" strokeWidth="2" strokeLinecap="round" />
        </g>
        <circle cx="299" cy="203" r="29" fill="#1a68c1" stroke="#e9f7ff" strokeWidth="5" />
        <path d="m287 204 8 8 16-19" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </>}
      {kind === "rhythm" && <>
        <ellipse cx="180" cy="240" rx="107" ry="11" fill="#1a68c110" />
        <g transform="rotate(-6 180 145)">
          <rect x="68" y="54" width="222" height="176" rx="21" fill="#badcf3" />
          <rect x="62" y="48" width="222" height="176" rx="21" fill={`url(#${id}-paper)`} stroke="#b7d8ef" />
          <path d="M83 48h180c12 0 21 9 21 21v30H62V69c0-12 9-21 21-21Z" fill={`url(#${id}-blue)`} />
          {[101, 148, 198, 245].map((x) => <g key={x}><rect x={x - 4} y="31" width="8" height="33" rx="4" fill="#1767b8" /><path d={`M${x - 1} 36v22`} stroke="#c5eaff" strokeWidth="2" strokeLinecap="round" /></g>)}
          {[0, 1, 2].map((row) => [0, 1, 2, 3, 4].map((col) => <rect key={`${row}-${col}`} x={84 + col * 36} y={117 + row * 29} width="23" height="17" rx="5" fill={row === 1 && col < 3 ? "#8dd1fb" : "#dfeefa"} />))}
          <rect x="84" y="146" width="95" height="17" rx="8.5" fill="#269aff" />
          <path d="m148 154 5 4 9-9" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <CareStar x={289} y={149} radius={16} fill="#269aff" />
      </>}
    </svg>
  );
}
