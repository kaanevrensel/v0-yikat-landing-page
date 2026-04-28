"use client"

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion"

interface WashingMachineProps {
  className?: string
}

export function WashingMachine({ className }: WashingMachineProps) {
  const prefersReducedMotion = useReducedMotion()
  const { scrollY, scrollYProgress } = useScroll()
  // 3 full turns across the page
  const rawAngle = useTransform(scrollYProgress, [0, 1], [0, 1080])
  const smooth = useSpring(rawAngle, { stiffness: 50, damping: 20 })
  const angle = prefersReducedMotion ? 0 : smooth

  // Machine body fades across the hero's scroll depth; knob stays opaque
  const bodyOpacity = useTransform(scrollY, [0, 380], [1, 0], { clamp: true })
  const effectiveBodyOpacity = prefersReducedMotion ? 1 : bodyOpacity

  return (
    <svg
      viewBox="0 0 900 1100"
      className={className}
      role="img"
      aria-label="Çamaşır makinesi illüstrasyonu"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Floor shadow */}
        <radialGradient id="floorShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000" stopOpacity="0.20" />
          <stop offset="60%" stopColor="#000" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>

        {/* Body: bright, matte white with ultra-subtle horizontal shading */}
        <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#E8E8E4" />
          <stop offset="10%" stopColor="#F6F6F3" />
          <stop offset="50%" stopColor="#FFFFFF" />
          <stop offset="90%" stopColor="#EFEFEB" />
          <stop offset="100%" stopColor="#DCDCD7" />
        </linearGradient>

        {/* very soft vertical overlay (subtle top-down) */}
        <linearGradient id="bodyGradV" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="40%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.05" />
        </linearGradient>

        {/* Black glossy control panel */}
        <linearGradient id="panelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1A1A1C" />
          <stop offset="35%" stopColor="#0D0D0F" />
          <stop offset="65%" stopColor="#0A0A0C" />
          <stop offset="100%" stopColor="#16161A" />
        </linearGradient>

        {/* Gloss highlight band on panel */}
        <linearGradient id="panelGloss" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.10" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.02" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        {/* Door dark interior */}
        <radialGradient id="glassInterior" cx="50%" cy="42%" r="62%">
          <stop offset="0%" stopColor="#2A2C30" />
          <stop offset="55%" stopColor="#121316" />
          <stop offset="100%" stopColor="#050608" />
        </radialGradient>

        {/* Drum visible inside */}
        <radialGradient id="drumGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4A4D52" />
          <stop offset="70%" stopColor="#1E2024" />
          <stop offset="100%" stopColor="#0B0C0E" />
        </radialGradient>

        {/* Glass reflection */}
        <linearGradient id="glassHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.40" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        {/* Door black rubber ring (replaces chrome bezel) */}
        <radialGradient id="doorRing" cx="50%" cy="48%" r="58%">
          <stop offset="0%" stopColor="#242528" />
          <stop offset="70%" stopColor="#0E0F11" />
          <stop offset="100%" stopColor="#000000" />
        </radialGradient>

        {/* Detergent drawer (white, flush with body) */}
        <linearGradient id="drawerFace" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#EDEDE9" />
          <stop offset="100%" stopColor="#FBFBF8" />
        </linearGradient>

        {/* Base feet */}
        <radialGradient id="footGrad" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#D6D6D1" />
          <stop offset="100%" stopColor="#9A9A95" />
        </radialGradient>

        {/* Drum holes */}
        <pattern id="drumHoles" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="1.4" fill="#050608" opacity="0.6" />
        </pattern>

        <clipPath id="glassClip">
          <circle cx="450" cy="590" r="190" />
        </clipPath>

        <filter id="doorShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="5" />
          <feOffset dx="0" dy="6" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.28" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <motion.g style={{ opacity: effectiveBodyOpacity }}>

      {/* Floor shadow */}
      <ellipse cx="450" cy="1030" rx="320" ry="22" fill="url(#floorShadow)" />

      {/* ===== Cabinet ===== */}
      <rect x="120" y="150" width="660" height="860" rx="10" ry="10" fill="url(#bodyGrad)" />
      <rect x="120" y="150" width="660" height="860" rx="10" ry="10" fill="url(#bodyGradV)" />

      {/* Faint side seams */}
      <line x1="130" y1="175" x2="130" y2="990" stroke="#000" strokeOpacity="0.04" strokeWidth="1" />
      <line x1="770" y1="175" x2="770" y2="990" stroke="#000" strokeOpacity="0.04" strokeWidth="1" />

      {/* ===== Black control panel strip (full width, top) ===== */}
      <g>
        <rect x="120" y="150" width="660" height="120" rx="10" ry="10" fill="url(#panelGrad)" />
        {/* Mask bottom corners so panel sits flush (only top corners rounded) */}
        <rect x="120" y="230" width="660" height="40" fill="url(#panelGrad)" />
        {/* Gloss sheen */}
        <rect x="120" y="150" width="660" height="60" rx="10" ry="10" fill="url(#panelGloss)" />
        {/* Bottom hairline separator to body */}
        <rect x="120" y="268" width="660" height="2" fill="#000" opacity="0.35" />
        <rect x="120" y="270" width="660" height="1" fill="#ffffff" opacity="0.3" />

        {/* === Panel contents (minimal, no brand) === */}

        {/* Tiny indicator dots / status row (far left) */}
        <g fontFamily="Helvetica, Arial, sans-serif" fill="#E8E8E4" letterSpacing="1.2">
          <text x="155" y="185" fontSize="7" opacity="0.75">MODE</text>
          <text x="155" y="218" fontSize="10" fontWeight="500">Cotton</text>
          <text x="155" y="234" fontSize="6" fill="#8A8A86" letterSpacing="1">40°  •  1200 RPM</text>
        </g>

        {/* Digital display (left cluster) */}
        <g>
          <rect x="240" y="178" width="130" height="60" rx="3" fill="#07080A" />
          <rect x="241" y="179" width="128" height="58" rx="2.5" fill="none" stroke="#1C1D20" strokeWidth="1" />
          <text x="305" y="193" textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontSize="6" fill="#4A7A94" letterSpacing="1.5">TIME REMAINING</text>
          <text
            x="305"
            y="226"
            textAnchor="middle"
            fontFamily="'Courier New', ui-monospace, monospace"
            fontSize="26"
            fontWeight="700"
            fill="#BFE3FA"
            letterSpacing="3"
            style={{ filter: "drop-shadow(0 0 3px rgba(150,210,250,0.55))" }}
          >
            04:32
          </text>
        </g>

        {/* Mode icons row (right cluster) */}
        <g fill="#CFCFCA" fontFamily="Helvetica, Arial, sans-serif" fontSize="6" letterSpacing="0.8" textAnchor="middle" opacity="0.85">
          <g transform="translate(555 195)">
            <circle r="9" fill="none" stroke="#5A5A57" strokeWidth="0.8" />
            <circle r="4" fill="#6FA8C9" opacity="0.7" />
            <text y="22" fill="#8A8A86">ECO</text>
          </g>
          <g transform="translate(595 195)">
            <rect x="-7" y="-7" width="14" height="14" rx="2" fill="none" stroke="#5A5A57" strokeWidth="0.8" />
            <text y="22" fill="#8A8A86">SPIN</text>
          </g>
          <g transform="translate(635 195)">
            <path d="M -7 3 Q -3 -6 0 3 Q 3 -6 7 3" fill="none" stroke="#5A5A57" strokeWidth="0.8" />
            <text y="22" fill="#8A8A86">RINSE</text>
          </g>
          <g transform="translate(675 195)">
            <path d="M 0 -7 L 6 7 L -6 7 Z" fill="none" stroke="#5A5A57" strokeWidth="0.8" />
            <text y="22" fill="#8A8A86">QUICK</text>
          </g>
          <g transform="translate(725 195)">
            <circle r="3" fill="#6FDA9A" opacity="0.95" style={{ filter: "drop-shadow(0 0 3px rgba(111,218,154,0.8))" }} />
            <text y="22" fill="#8A8A86">START</text>
          </g>
        </g>

      </g>

      {/* ===== Detergent drawer (upper-left below panel) ===== */}
      <g>
        {/* shallow recess */}
        <rect x="140" y="292" width="200" height="54" rx="4" fill="#D8D8D3" />
        <rect x="142" y="294" width="196" height="50" rx="3" fill="url(#drawerFace)" />
        {/* handle indent (slim slot on top edge) */}
        <rect x="210" y="298" width="60" height="5" rx="2" fill="#C4C4BF" />
        {/* drawer compartment separator lines */}
        <line x1="205" y1="296" x2="205" y2="344" stroke="#C4C4BF" strokeWidth="0.8" opacity="0.7" />
        <line x1="275" y1="296" x2="275" y2="344" stroke="#C4C4BF" strokeWidth="0.8" opacity="0.7" />
        {/* subtle roman numerals */}
        <text x="172" y="328" fontFamily="Helvetica, Arial, sans-serif" fontSize="9" fill="#9A9A95" textAnchor="middle" letterSpacing="1">I</text>
        <text x="240" y="328" fontFamily="Helvetica, Arial, sans-serif" fontSize="9" fill="#9A9A95" textAnchor="middle" letterSpacing="1">II</text>
        <text x="308" y="328" fontFamily="Helvetica, Arial, sans-serif" fontSize="8" fill="#9A9A95" textAnchor="middle">✱</text>
      </g>

      {/* ===== Drain filter cover (minimal outline only, flush with body) ===== */}
      <g>
        {/* subtle outer shadow line (just a hint of depth) */}
        <circle cx="700" cy="935" r="38" fill="none" stroke="#000" strokeOpacity="0.08" strokeWidth="1" />
        {/* soft highlight line (top-left edge) */}
        <path d="M 670 925 A 38 38 0 0 1 710 900" fill="none" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="1" />
        {/* tiny dimple / pry-point (very small dot) */}
        <circle cx="675" cy="930" r="1.2" fill="#000" opacity="0.18" />
      </g>

      {/* ===== Door assembly (NO chrome — black rubber ring blending into body) ===== */}
      <g filter="url(#doorShadow)">
        {/* Outer static ring blending into body */}
        <circle cx="450" cy="590" r="220" fill="#F2F2EE" />
        <g>
          {/* Inner black ring (gasket / rim) */}
          <circle cx="450" cy="590" r="210" fill="url(#doorRing)" />
          {/* Slight inner rim shade */}
          <circle cx="450" cy="590" r="196" fill="#0A0B0D" />
          <circle cx="450" cy="395" r="3" fill="#2A2B2E" />
        </g>
      </g>

      {/* Drum + clothes (BEHIND the tinted glass) */}
      <g clipPath="url(#glassClip)">
        {/* Static drum backdrop */}
        <circle cx="450" cy="590" r="160" fill="url(#drumGrad)" />

        {/* Rotating drum interior: holes pattern + paddles + clothes */}
        <motion.g
          id="drumRotor"
          style={{
            rotate: angle,
            transformOrigin: "450px 590px",
            transformBox: "view-box",
          }}
        >
          {/* holes pattern rotates with drum */}
          <circle cx="450" cy="590" r="160" fill="url(#drumHoles)" />

          {/* Three paddles (120° apart) */}
          <g>
            <path d="M 360 510 Q 450 490 540 510 L 528 532 Q 450 515 372 532 Z" fill="#0B0C0E" opacity="0.8" />
            <path d="M 360 510 Q 450 490 540 510 L 528 532 Q 450 515 372 532 Z" fill="#0B0C0E" opacity="0.8" transform="rotate(120 450 590)" />
            <path d="M 360 510 Q 450 490 540 510 L 528 532 Q 450 515 372 532 Z" fill="#0B0C0E" opacity="0.8" transform="rotate(240 450 590)" />
          </g>

          {/* ===== Messy laundry pile — one chaotic mass, rotates with drum ===== */}
          <g id="laundryPile">
            {/* Base shadow */}
            <ellipse cx="450" cy="742" rx="135" ry="8" fill="#000" opacity="0.4" />

            {/* BACK LAYER: big masses tucked deep */}
            {/* mustard / ochre (pulled down) */}
            <path d="M 325 665 Q 350 625 405 618 Q 455 616 492 635 Q 475 660 430 665 Q 380 675 345 695 Q 325 692 325 665 Z" fill="#E8A94A" />
            <path d="M 350 640 Q 395 632 450 638" stroke="#B37D2E" strokeWidth="2.1" fill="none" strokeLinecap="round" opacity="0.75" />
            <path d="M 340 660 Q 385 658 440 662" stroke="#B37D2E" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.65" />

            {/* teal/green peeking (pulled down) */}
            <path d="M 430 610 Q 480 602 535 618 Q 560 640 545 665 Q 510 665 475 658 Q 445 650 430 632 Q 425 618 430 610 Z" fill="#4FA390" />
            <path d="M 455 625 Q 500 620 535 632" stroke="#2E6E5F" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <path d="M 475 645 Q 510 643 540 652" stroke="#2E6E5F" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.8" />

            {/* navy / dark blue (pulled down) */}
            <path d="M 510 622 Q 555 618 580 642 Q 588 672 565 690 Q 530 683 515 665 Q 500 640 510 622 Z" fill="#2E4A7A" />
            <path d="M 525 638 Q 555 640 575 652" stroke="#1A2E54" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M 520 660 Q 545 663 570 672" stroke="#1A2E54" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.8" />

            {/* MIDDLE LAYER: crumpled colorful shapes */}
            {/* purple/pink cloth (widened right to fill mid gap) */}
            <path d="M 320 675 Q 380 648 445 660 Q 485 672 495 700 Q 465 718 405 715 Q 355 712 325 698 Q 310 688 320 675 Z" fill="#B76A9E" />
            <path d="M 345 680 Q 410 678 480 692" stroke="#7E4570" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <path d="M 360 700 Q 425 700 485 708" stroke="#7E4570" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.75" />

            {/* red/coral, dominant middle (extended left to overlap purple heavily) */}
            <path d="M 370 665 Q 435 645 520 658 Q 568 678 565 710 Q 515 722 460 716 Q 415 708 385 692 Q 365 675 370 665 Z" fill="#E2604F" />
            <path d="M 400 685 Q 480 680 545 695" stroke="#9E3A2E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 415 702 Q 490 705 550 712" stroke="#9E3A2E" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.8" />
            <path d="M 390 670 Q 455 663 505 666" stroke="#F4958A" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.85" />

            {/* yellow striped towel peeking out right (widened to meet red+navy) */}
            <path d="M 500 682 Q 562 685 588 712 Q 575 738 525 735 Q 490 728 495 705 Q 498 690 500 682 Z" fill="#F0C657" />
            <path d="M 508 700 L 582 707" stroke="#C79636" strokeWidth="1.3" />
            <path d="M 504 714 L 580 720" stroke="#C79636" strokeWidth="1.3" />
            <path d="M 500 728 L 578 728" stroke="#C79636" strokeWidth="1.3" />

            {/* grey/knit item left (expanded to meet purple + floor) */}
            <path d="M 310 690 Q 345 662 388 683 Q 398 714 365 732 Q 322 732 308 718 Q 300 702 310 690 Z" fill="#9AA0A6" />
            <g stroke="#6E747B" strokeWidth="0.8" fill="none" opacity="0.85">
              <path d="M 315 700 L 388 700" />
              <path d="M 313 712 L 388 712" />
              <path d="M 312 724 L 382 724" />
            </g>

            {/* FRONT LAYER: crumpled / socks poking out */}
            {/* white sheet drape front-center (stretches pile to pile) */}
            <path d="M 330 710 Q 400 693 475 706 Q 545 718 580 732 Q 550 746 480 744 Q 405 741 355 730 Q 315 723 330 710 Z" fill="#F6F3EC" />
            <path d="M 352 720 Q 440 720 535 730" stroke="#C9C5B8" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <path d="M 370 735 Q 455 738 548 738" stroke="#C9C5B8" strokeWidth="1.3" fill="none" strokeLinecap="round" opacity="0.85" />

            {/* red-polka-dot sock front-left */}
            <g transform="translate(358 722) rotate(-28)">
              <path d="M -18 -8 Q -20 0 -12 5 L 4 11 Q 10 12 13 8 L 14 4 Q 9 1 2 -1 L -8 -5 L -8 -8 Z" fill="#D14A42" />
              <circle cx="-10" cy="-3" r="1.2" fill="#F6F3EC" />
              <circle cx="-3" cy="0" r="1.2" fill="#F6F3EC" />
              <circle cx="5" cy="4" r="1.2" fill="#F6F3EC" />
              <path d="M -18 -6 L -8 -6" stroke="#8C2A24" strokeWidth="1.3" />
            </g>

            {/* striped orange sock peeking middle */}
            <g transform="translate(455 727) rotate(12)">
              <path d="M -14 -7 Q -16 0 -10 4 L 3 10 Q 8 11 10 8 L 12 4 Q 7 1 2 0 L -6 -4 L -6 -7 Z" fill="#F4F1EA" />
              <path d="M -14 -5 L -6 -5" stroke="#E86A2E" strokeWidth="1.3" />
              <path d="M -14 -2 L -5 -2" stroke="#E86A2E" strokeWidth="1.3" />
              <path d="M -12 2 L -3 2" stroke="#E86A2E" strokeWidth="1.1" />
            </g>

            {/* small bright accent: cyan patch top (pulled down) */}
            <path d="M 398 610 Q 432 598 472 612 Q 462 628 428 628 Q 402 628 398 610 Z" fill="#6BB8D4" />
            <path d="M 413 614 Q 443 610 462 620" stroke="#3A7F9C" strokeWidth="1.5" fill="none" strokeLinecap="round" />

            {/* highlight wisp on pile */}
            <path d="M 360 655 Q 400 645 445 650" stroke="#ffffff" strokeWidth="1.3" fill="none" strokeLinecap="round" opacity="0.3" />
          </g>

        </motion.g>

        {/* water placeholder (no-op, keeps tinted glass overlay structure below) */}
        <g>

          {/* ======= LAUNDRY (drawn BETWEEN drum rotor and glass tint) ======= */}
          {/* Each garment is drawn around origin (0,0); JS positions + rotates via transform */}
          <defs>
            {/* T-SHIRT: body + sleeves + collar + seam highlight */}
            <g id="garment-tshirt">
              <path
                d="M -34 -18 L -22 -26 L -10 -22 Q 0 -18 10 -22 L 22 -26 L 34 -18 L 30 -8 L 22 -10 L 22 22 L -22 22 L -22 -10 L -30 -8 Z"
                fill="#E8584E"
              />
              {/* collar */}
              <path d="M -10 -22 Q 0 -14 10 -22 L 8 -20 Q 0 -12 -8 -20 Z" fill="#B33D35" />
              {/* shoulder seam shadow */}
              <path d="M -22 -10 L -22 -22 M 22 -10 L 22 -22" stroke="#B33D35" strokeWidth="1.3" fill="none" opacity="0.7" />
              {/* body highlight */}
              <path d="M -14 -6 Q -12 8 -14 20" stroke="#F47E74" strokeWidth="2" fill="none" opacity="0.55" strokeLinecap="round" />
              {/* fold shadow */}
              <path d="M 6 -4 Q 10 8 4 20" stroke="#A8332B" strokeWidth="1.5" fill="none" opacity="0.55" strokeLinecap="round" />
            </g>

            {/* JEANS: folded at knees, waistband + leg folds */}
            <g id="garment-jeans">
              <path
                d="M -26 -16 L 26 -16 L 26 -10 L 22 18 L 8 18 L 4 -6 L -4 -6 L -8 18 L -22 18 L -26 -10 Z"
                fill="#4A6B92"
              />
              {/* waistband */}
              <rect x="-26" y="-16" width="52" height="6" fill="#33486A" />
              {/* fly stitch */}
              <path d="M 0 -10 L 0 -2" stroke="#F0C86A" strokeWidth="0.8" strokeDasharray="1.5 1" />
              {/* side seam / leg fold lines */}
              <path d="M -15 -8 L -12 16 M 15 -8 L 12 16" stroke="#2D3E5E" strokeWidth="1" fill="none" opacity="0.7" />
              {/* denim highlight */}
              <path d="M -20 -4 Q -16 8 -18 16 M 20 -4 Q 16 8 18 16" stroke="#6A8AB2" strokeWidth="1.3" fill="none" opacity="0.55" strokeLinecap="round" />
              {/* pocket rivet */}
              <circle cx="-14" cy="-6" r="0.8" fill="#F0C86A" />
              <circle cx="14" cy="-6" r="0.8" fill="#F0C86A" />
            </g>

            {/* TOWEL: striped with fringe ends */}
            <g id="garment-towel">
              <rect x="-28" y="-12" width="56" height="24" rx="1" fill="#F0C85A" />
              {/* woven stripes */}
              <rect x="-28" y="-10" width="56" height="1.5" fill="#D8A942" opacity="0.7" />
              <rect x="-28" y="-6" width="56" height="1" fill="#D8A942" opacity="0.5" />
              <rect x="-28" y="6" width="56" height="1" fill="#D8A942" opacity="0.5" />
              <rect x="-28" y="9" width="56" height="1.5" fill="#D8A942" opacity="0.7" />
              {/* fringe ends */}
              <g stroke="#E8BA50" strokeWidth="0.8">
                <line x1="-28" y1="-12" x2="-32" y2="-11" />
                <line x1="-28" y1="-6" x2="-32" y2="-5" />
                <line x1="-28" y1="0" x2="-32" y2="1" />
                <line x1="-28" y1="6" x2="-32" y2="7" />
                <line x1="-28" y1="12" x2="-32" y2="11" />
                <line x1="28" y1="-12" x2="32" y2="-11" />
                <line x1="28" y1="-6" x2="32" y2="-5" />
                <line x1="28" y1="0" x2="32" y2="1" />
                <line x1="28" y1="6" x2="32" y2="7" />
                <line x1="28" y1="12" x2="32" y2="11" />
              </g>
            </g>

            {/* SOCK: curved tube with cuff */}
            <g id="garment-sock">
              <path
                d="M -18 -10 Q -20 -4 -14 2 L 2 14 Q 8 16 12 12 L 14 8 Q 10 4 4 2 L -8 -6 L -8 -10 Z"
                fill="#EFEDE4"
              />
              {/* cuff stripe */}
              <path d="M -18 -8 L -8 -8" stroke="#B34D45" strokeWidth="2" />
              <path d="M -18 -5 L -8 -5" stroke="#2A4B7A" strokeWidth="1.2" />
              {/* heel shadow */}
              <path d="M -6 0 Q 0 4 6 6" stroke="#C9C6B8" strokeWidth="1.3" fill="none" opacity="0.8" strokeLinecap="round" />
            </g>

            {/* SWEATER: green knit with ribbing */}
            <g id="garment-sweater">
              <path
                d="M -32 -14 L -20 -22 L -8 -18 Q 0 -14 8 -18 L 20 -22 L 32 -14 L 28 -6 L 22 -8 L 22 20 L -22 20 L -22 -8 L -28 -6 Z"
                fill="#78A060"
              />
              {/* knit texture rows */}
              <g stroke="#5D8249" strokeWidth="0.6" fill="none" opacity="0.7">
                <path d="M -20 -4 L 20 -4" />
                <path d="M -20 2 L 20 2" />
                <path d="M -20 8 L 20 8" />
                <path d="M -20 14 L 20 14" />
              </g>
              {/* cuff rib */}
              <rect x="-22" y="16" width="44" height="4" fill="#5D8249" opacity="0.75" />
              {/* collar */}
              <path d="M -8 -18 Q 0 -10 8 -18 L 6 -16 Q 0 -8 -6 -16 Z" fill="#5D8249" />
              {/* highlight */}
              <path d="M -14 -2 Q -12 10 -14 18" stroke="#A0C586" strokeWidth="1.3" fill="none" opacity="0.55" strokeLinecap="round" />
            </g>
          </defs>

          {/* Static pile of clothes, sitting at bottom of drum.
               Lives INSIDE drumRotor so it rotates with the drum. */}

          {/* === Tinted glass overlay (ON TOP of drum + clothes) === */}
          {/* Dark semi-transparent tint so clothes show through darkly */}
          <circle cx="450" cy="590" r="190" fill="#0A0B0E" opacity="0.55" />
          {/* Radial vignette to deepen edges of the glass */}
          <circle cx="450" cy="590" r="190" fill="url(#glassInterior)" opacity="0.35" />

          {/* Glass reflection sweep */}
          <path
            d="M 290 460 Q 380 480 420 560 Q 440 620 380 720 L 275 720 L 275 460 Z"
            fill="url(#glassHighlight)"
            opacity="0.75"
          />
          <ellipse cx="370" cy="500" rx="30" ry="10" fill="#ffffff" opacity="0.38" transform="rotate(-32 370 500)" />
          <ellipse cx="385" cy="520" rx="10" ry="3" fill="#ffffff" opacity="0.65" transform="rotate(-32 385 520)" />
        </g>
      </g>

      {/* Small hinge detail (left side, subtle) */}
      <rect x="228" y="575" width="8" height="36" rx="1.5" fill="#7A7A77" opacity="0.7" />

      {/* Feet removed per request */}

      {/* Subtle body side-edge highlights */}
      <rect x="128" y="280" width="3" height="700" rx="1.5" fill="#ffffff" opacity="0.5" />
      <rect x="769" y="280" width="3" height="700" rx="1.5" fill="#000" opacity="0.04" />

      </motion.g>

    </svg>
  )
}
