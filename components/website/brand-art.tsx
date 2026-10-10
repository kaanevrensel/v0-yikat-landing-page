"use client";

import { useId } from "react";

export type CareGlyphKind = "message" | "place" | "app" | "order" | "collect" | "wash" | "ready";

export function CareStar({ x, y, radius, fill = "white" }: { x: number; y: number; radius: number; fill?: string }) {
  return <path d="M20 0C21.5 14.5 25.5 18.5 40 20C25.5 21.5 21.5 25.5 20 40C18.5 25.5 14.5 21.5 0 20C14.5 18.5 18.5 14.5 20 0Z" transform={`translate(${x - radius} ${y - radius}) scale(${radius / 20})`} fill={fill} />;
}

/** Original YIKAT marks: soft manufactured shapes, blue edges and a care glint. */
export function CareGlyph({ kind, className = "" }: { kind: CareGlyphKind; className?: string }) {
  const id = useId();
  return (
    <svg className={`care-glyph ${className}`} viewBox="0 0 80 80" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-blue`} x1="15" y1="12" x2="60" y2="71" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5bc2ff" /><stop offset=".48" stopColor="#269aff" /><stop offset="1" stopColor="#1763b8" />
        </linearGradient>
        <linearGradient id={`${id}-white`} x1="25" y1="15" x2="55" y2="69" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" /><stop offset="1" stopColor="#dbefff" />
        </linearGradient>
      </defs>
      {kind === "message" && <>
        <path d="M31 32h26c10 0 16 6 16 15v4c0 8-5 14-12 15l-1 8-11-7H37c-10 0-16-5-16-14V47c0-8 3-12 10-15Z" fill="#b6ddf8" />
        <path d="M10 32c0-14 9-23 25-23h10c15 0 24 9 24 23v3c0 14-9 23-24 23H33L18 68l1-15c-6-4-9-10-9-18Z" fill={`url(#${id}-blue)`} stroke="#2786d0" strokeWidth="1.2" />
        <path d="M17 27c2-8 8-12 18-12h12" stroke="#b8e7ff" strokeWidth="2" strokeLinecap="round" />
        <CareStar x={39} y={35} radius={14} />
      </>}
      {kind === "place" && <>
        <ellipse cx="41" cy="69" rx="23" ry="6" fill="#d1e8f8" />
        <path d="M65 31C65 14 54 6 40 6S15 15 15 31c0 17 25 38 25 38s25-21 25-38Z" fill={`url(#${id}-blue)`} stroke="#217ccb" strokeWidth="1.2" />
        <path d="M22 28c1-9 8-15 17-16" stroke="#bceaff" strokeWidth="2" strokeLinecap="round" />
        <circle cx="40" cy="31" r="12" fill={`url(#${id}-white)`} />
        <CareStar x={40} y={31} radius={9} fill="#269aff" />
      </>}
      {kind === "app" && <>
        <rect x="20" y="7" width="43" height="68" rx="12" fill="#155794" />
        <rect x="17" y="4" width="43" height="68" rx="12" fill={`url(#${id}-blue)`} stroke="#419bdd" />
        <rect x="22" y="9" width="33" height="57" rx="8" fill={`url(#${id}-white)`} />
        <path d="M33 10h11" stroke="#3c89c2" strokeWidth="3" strokeLinecap="round" />
        <rect x="27" y="26" width="23" height="24" rx="7" fill={`url(#${id}-blue)`} />
        <CareStar x={38.5} y={38.5} radius={9} />
        <path d="M34 60h9" stroke="#91bcda" strokeWidth="2" strokeLinecap="round" />
      </>}
      {kind === "order" && <>
        <path d="m23 11 41 4-5 59-6-4-6 3-6-4-7 3-6-4-10 2Z" fill="#b9dcf4" />
        <path d="M17 6h44v61l-7-4-7 4-8-4-7 4-7-4-8 4Z" fill={`url(#${id}-white)`} stroke="#80b8df" strokeWidth="1.2" />
        <rect x="25" y="15" width="28" height="22" rx="6" fill={`url(#${id}-blue)`} />
        <CareStar x={39} y={26} radius={8} />
        <path d="M26 45h25M26 51h15" stroke="#5599cd" strokeWidth="2" strokeLinecap="round" />
      </>}
      {kind === "collect" && <>
        <path d="m22 26 39-2 9 42c1 6-3 8-8 8H24c-7 0-10-4-9-10Z" fill="#b8ddf5" />
        <path d="M20 24h40l6 40c.8 5-2 8-7 8H21c-5 0-8-3-7-8Z" fill={`url(#${id}-blue)`} stroke="#2284ce" strokeWidth="1.2" />
        <path d="M28 29V20c0-16 24-16 24 0v9" stroke="#14548a" strokeWidth="5" strokeLinecap="round" />
        <path d="M28 27v-7c0-14 23-14 24 0" stroke="#79cfff" strokeWidth="2" strokeLinecap="round" />
        <CareStar x={40} y={50} radius={12} />
      </>}
      {kind === "wash" && <>
        <rect x="12" y="8" width="58" height="65" rx="14" fill="#b7dcf4" />
        <rect x="9" y="5" width="58" height="65" rx="14" fill={`url(#${id}-blue)`} stroke="#2786ce" strokeWidth="1.2" />
        <path d="M19 16h10" stroke="#c0ecff" strokeWidth="4" strokeLinecap="round" />
        <circle cx="56" cy="16" r="3" fill="white" />
        <circle cx="38" cy="44" r="19" fill="#145b9d" stroke="#b7e4ff" strokeWidth="3" />
        <g className="care-wash-drum">
          <circle cx="38" cy="44" r="14" fill="#73c6fc" />
          <path d="M24 44c7-8 18 10 28 0a14 14 0 0 1-28 0Z" fill="#e4f6ff" />
        </g>
        <CareStar x={47} y={36} radius={7} />
      </>}
      {kind === "ready" && <>
        <path d="m10 26 30-12 30 12v34L40 73 10 60Z" fill={`url(#${id}-blue)`} stroke="#2481c7" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="m10 26 30 12 30-12-30-12Z" fill="#8ad6ff" />
        <path d="M40 38v35" stroke="#8dd8ff" strokeWidth="1.5" />
        <path d="m28 19 29 12v16l-9 4V35L19 23Z" fill="#f5fcff" />
        <path d="m19 45 5 7 9-5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </>}
    </svg>
  );
}

export function StorefrontArt() {
  const id = useId();
  return (
    <svg className="storefront-art" viewBox="0 0 440 320" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-wall`} x1="102" y1="92" x2="310" y2="289" gradientUnits="userSpaceOnUse"><stop stopColor="#fff" /><stop offset="1" stopColor="#d8edfc" /></linearGradient>
        <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#87d6ff" /><stop offset="1" stopColor="#c9ecff" /></linearGradient>
        <linearGradient id={`${id}-blue`} x1="0" y1="0" x2=".5" y2="1"><stop stopColor="#57c1ff" /><stop offset="1" stopColor="#1a68c1" /></linearGradient>
      </defs>
      <ellipse cx="224" cy="288" rx="154" ry="13" fill="#176db018" />
      <path d="m323 96 30 18v164l-30 10Z" fill="#a2c8e4" />
      <path d="M93 89h237v197H93Z" fill={`url(#${id}-wall)`} stroke="#b8d7ed" strokeWidth="2" />
      <rect x="92" y="76" width="240" height="52" rx="12" fill={`url(#${id}-blue)`} />
      <image href="/images/yikat-wordmark.svg" x="171" y="88" width="82" height="30" />
      <path d="m86 129 18-12h218l18 12v22H86Z" fill="#1a68c1" />
      {[0, 1, 2, 3, 4, 5, 6].map((index) => (
        <g key={index}>
          <path d={`m${86 + index * 36.3} 129 ${18 - index * 5.2} -12h31.2l${-12.8 + index * 5.2} 12Z`} fill={index % 2 ? "#f5fbff" : "#5dc4ff"} />
          <path d={`M${86 + index * 36.3} 129h36.3v20c0 18-36.3 18-36.3 0Z`} fill={index % 2 ? "#f5fbff" : `url(#${id}-blue)`} />
        </g>
      ))}
      <rect x="111" y="172" width="123" height="95" rx="5" fill="#9ccced" stroke="#fff" strokeWidth="5" />
      <rect x="116" y="177" width="113" height="85" rx="2" fill={`url(#${id}-glass)`} />
      <path d="m128 177 50 85m-12-85 50 85" stroke="#ffffff5c" strokeWidth="11" />
      <rect x="248" y="168" width="62" height="114" rx="5" fill="#1c73b5" />
      <rect x="254" y="174" width="50" height="103" rx="3" fill={`url(#${id}-glass)`} />
      <path d="M298 225v17" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
      <path d="M96 282h236l8 8H88Z" fill="#98c5e4" />
      <path d="m137 224 13-15 17 8 9 13 31 9c5 2 6 13-1 13h-68c-13 0-14-15-1-28Z" fill="#fff" stroke="#6db4e5" strokeWidth="2" />
      <path d="m152 219 10 4m-14 2 15 4m-25 15h69" stroke="#389bea" strokeWidth="2" strokeLinecap="round" />
      <CareStar x={302} y={53} radius={17} fill="#269aff" />
      <CareStar x={354} y={91} radius={11} fill="#6bc7ff" />
    </svg>
  );
}

export function TimeDial({ slot }: { slot: number }) {
  const id = useId();
  return (
    <svg className="time-dial" viewBox="0 0 240 220" fill="none" aria-hidden="true" focusable="false">
      <defs><linearGradient id={`${id}-case`} x1="40" y1="22" x2="186" y2="195" gradientUnits="userSpaceOnUse"><stop stopColor="#8bd9ff" /><stop offset=".4" stopColor="#269aff" /><stop offset="1" stopColor="#1665b7" /></linearGradient></defs>
      <ellipse cx="120" cy="199" rx="70" ry="10" fill="#1a68c113" />
      <circle cx="120" cy="107" r="89" fill={`url(#${id}-case)`} stroke="#6ac3fa" strokeWidth="2" />
      <circle cx="120" cy="107" r="76" fill="#f8fcff" stroke="#c7e7fc" strokeWidth="4" />
      {Array.from({ length: 12 }, (_, index) => <path key={index} d="M120 40v6" stroke={index % 3 ? "#b6d2e8" : "#2a7cbd"} strokeWidth={index % 3 ? 2 : 3} strokeLinecap="round" transform={`rotate(${index * 30} 120 107)`} />)}
      <path className="dial-hour" d="M120 107V67" stroke="#12476f" strokeWidth="6" strokeLinecap="round" style={{ transform: `rotate(${[330, 450, 570][slot]}deg)` }} />
      <path className="dial-minute" d="M120 107v-56" stroke="#269aff" strokeWidth="3" strokeLinecap="round" />
      <circle cx="120" cy="107" r="7" fill="#269aff" stroke="white" strokeWidth="3" />
      <CareStar x={120} y={147} radius={10} fill="#a4d7f9" />
    </svg>
  );
}
