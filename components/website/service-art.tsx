import { useId } from "react";

export type ServiceArtKind = "ayakkabi" | "dry-cleaning" | "kiloyla" | "utu" | "hacimli";

/** Small-format artwork: custom silhouettes, cut seams and enamel-blue details.
 * The photographic hero sculptures and the in-app assets are separate families.
 */
export function ServiceArt({ kind, className = "", label }: {
  kind: ServiceArtKind;
  className?: string;
  label?: string;
}) {
  const id = useId().replace(/:/g, "");
  const blue = `url(#${id}-blue)`;
  const paper = `url(#${id}-paper)`;
  return (
    <svg viewBox="0 0 200 180" className={`service-art service-art-${kind} ${className}`} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true} focusable="false">
      <defs>
        <linearGradient id={`${id}-blue`} x1="0" y1="0" x2=".65" y2="1">
          <stop stopColor="#60bcff" /><stop offset="1" stopColor="#2078ce" />
        </linearGradient>
        <linearGradient id={`${id}-paper`} x1="0" y1="0" x2=".4" y2="1">
          <stop stopColor="#fff" /><stop offset="1" stopColor="#edf7ff" />
        </linearGradient>
      </defs>
      <g stroke="#225c8d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {kind === "ayakkabi" && <>
          <path d="M31 126c-2-18 1-39 10-58l21 12c9 4 16 2 24-7l18 23 25 13 34 8c12 3 17 10 17 22H37c-5 0-7-6-6-13Z" fill={paper} />
          <path d="m39 74 9 6-5 40H30c0-18 3-33 9-46Z" fill={blue} stroke="none" />
          <path d="m62 80 10 31 53 12 10-12M102 97l-12 14M112 104l-10 12" fill="none" stroke="#8bb9da" strokeWidth="2" />
          <path d="m73 83 16 4m-11 5 18 5m-11 4 18 5" stroke="#2078ce" strokeWidth="4" />
          <path d="M29 129c39 4 112 5 151-1v12c0 8-7 12-16 12H40c-9 0-13-5-11-13Z" fill={blue} />
          <path d="M40 141h126" stroke="#e9f7ff" strokeWidth="2" />
          <path d="m136 110 3 18M59 117l7 12" fill="none" stroke="#8bb9da" strokeWidth="2" />
          <g transform="translate(118 30) rotate(12)">
            <path d="M0 8c13-10 25-8 38 0v19H0Z" fill="#f7fbff" />
            <path d="M-3 27h44v14H-3Z" fill={blue} />
            <path d="M1 41v9m7-9v9m7-9v9m7-9v9m7-9v9m7-9v9" stroke="#72aed9" strokeWidth="3" />
          </g>
        </>}
        {kind === "dry-cleaning" && <>
          <path d="M91 30c0-13 18-15 20-3 1 8-12 8-12 17v8" fill="none" stroke="#267bbd" strokeWidth="4" />
          <path d="m99 48-46 28c-6 4-4 10 4 10h87c8 0 10-6 3-10L99 48Z" fill="#d6efff" />
          <path d="m77 60-33 22 4 72c0 9 6 13 14 13h75c9 0 15-5 15-14l4-71-34-22c-12 10-31 10-45 0Z" fill={paper} />
          <path d="m77 60-12 23 20 23 14-31-22-15Zm45 0 13 23-21 23-15-31 23-15Z" fill={blue} />
          <path d="M99 78v81M56 92l3 60m82-60-3 60" stroke="#9ac3e1" strokeWidth="2" />
          <path d="M99 120v14" stroke="#267bbd" strokeWidth="4" />
          <path d="m143 98 20 8-7 30-24-5 4-24 7-9Z" fill={blue} />
          <circle cx="143" cy="108" r="2" fill="#fff" stroke="none" />
          <path d="m140 118 12 3m-14 4 8 2" stroke="#fff" strokeWidth="2" />
        </>}
        {kind === "kiloyla" && <>
          <path d="m49 46 28-13c12 8 24 8 36 0l28 13 21 26-22 18-10-12v61H62V78L52 90 30 72l19-26Z" fill={paper} />
          <path d="M77 33c2 21 32 22 36 0" fill="none" stroke="#4ba8e7" strokeWidth="8" />
          <path d="m49 47 13 31m79-32-11 32M69 128h55" fill="none" stroke="#94c4e5" strokeWidth="2" />
          <path d="M55 113h82c16 0 23 10 23 23v13c0 11-10 16-20 16H52c-15 0-23-9-23-23s10-29 26-29Z" fill={blue} />
          <path d="M54 113c-15 0-25 13-25 29 0 14 8 23 23 23s24-9 24-24-9-22-20-22c-10 0-17 8-17 18s5 17 14 17c7 0 12-5 12-11 0-5-3-9-8-9" fill="#e3f4ff" />
          <path d="M119 114v50m9-50v50" stroke="#d7efff" strokeWidth="3" />
          <path d="M86 152h21" stroke="#8acaff" strokeWidth="2" />
        </>}
        {kind === "utu" && <>
          <path d="m37 138 15 17h117l-7-17H37Z" fill="#dbedfb" stroke="#91bbdc" />
          <path d="M40 123c13-30 34-47 68-47h45l19 47H40Z" fill={blue} />
          <path d="M89 79V53c0-11 8-18 20-18h24c14 0 21 9 21 22v27h-16V58c0-4-2-7-6-7h-24c-3 0-5 2-5 5v21" fill={paper} />
          <path d="m45 115 123-1 7 13c-37 6-92 6-138 1l8-13Z" fill={paper} />
          <path d="M37 131h138" stroke="#267dc2" strokeWidth="4" />
          <path d="M108 82h16" stroke="#edf9ff" strokeWidth="5" />
          <path d="M75 91c-8 4-16 11-22 18" fill="none" stroke="#a3d8ff" strokeWidth="2" />
          <path d="m44 71-8-6m16-6-4-8" stroke="#67b8ee" strokeWidth="3" />
          <path d="M152 58h7c8 0 12-5 12-12" fill="none" />
          <path d="M62 145h42" stroke="#b0d4ec" strokeWidth="2" />
        </>}
        {kind === "hacimli" && <>
          <g transform="rotate(-7 116 55)">
            <path d="M78 29c19-7 63-7 79 1 4 12 4 35 0 47-23 5-58 4-79-1-5-15-5-32 0-47Z" fill={paper} />
            <path d="M84 35c20-4 46-4 66 0m-66 34c19 3 46 4 65 1" fill="none" stroke="#a3c9e4" strokeWidth="2" />
          </g>
          <path d="m40 109 113-10c17-1 25 12 23 26-2 13-12 21-25 23L50 157c-17 1-27-12-26-25 0-12 5-19 16-23Z" fill={paper} />
          <path d="m48 133 101-8c11-1 15 2 14 8-1 5-6 8-12 8l-99 9" fill="none" stroke="#96bfdd" strokeWidth="2" />
          <path d="m42 80 109-11c18-2 28 9 28 22 0 15-12 24-28 25l-104 9c-17 2-26-11-25-24 1-11 8-20 20-21Z" fill={paper} />
          <path d="m43 99 109-11c8-1 14 1 14 7s-7 8-14 9l-107 9" fill="none" stroke="#6dacd8" strokeWidth="2" />
          <path d="M40 71c27-9 77-13 112-6 11 4 13 13 7 21l-82 9-8 38-36-6 5-37c-8-5-8-15 2-19Z" fill={blue} />
          <path d="m45 77 108-8M41 90l38 5m-39 9 34 5m-34 9 31 5M54 74l-6 55m26-58-8 61m29-63-3 24m29-25-1 22" fill="none" stroke="#b7e2ff" strokeWidth="1.7" />
          <path d="m33 128 36 5" stroke="#236aa1" strokeWidth="3" />
        </>}
      </g>
    </svg>
  );
}
