export interface Section {
  /** DOM id — also used as anchor (#{id}) */
  id: string
  /** Dial label shown around the ring */
  label: string
  /** Long label for a11y / aria-label */
  ariaLabel: string
  /** Angle in degrees (clockwise from 3 o'clock). Position before dial rotation. */
  angle: number
  /** If true, label renders in brand color when active */
  highlight?: boolean
  /** Native emoji placeholder. Swapped to /public/emojis/{id}.png when that file exists. */
  emoji?: string
  /** Display number shown in the section eyebrow (e.g. "01"). Undefined for hero. */
  number?: string
}

export const SECTIONS: readonly Section[] = [
  { id: 'basla',      label: 'YIKAT',     ariaLabel: 'Başa dön',                   angle: 0   /* no emoji, no number — hero */ },
  { id: 'hizmetler',  label: 'HİZMETLER', ariaLabel: 'Hizmetler bölümüne git',     angle: 45,  emoji: '🧺',  number: '01' },
  { id: 'nasil',      label: 'NASIL',     ariaLabel: 'Nasıl çalışır bölümüne git', angle: 90,  emoji: '📱',  number: '02' },
  { id: 'fiyatlar',   label: 'FİYATLAR',  ariaLabel: 'Fiyatlar bölümüne git',      angle: 135, emoji: '💰',  number: '03' },
  { id: 'neden',      label: 'NEDEN',     ariaLabel: 'Neden YIKAT bölümüne git',   angle: 180, emoji: '✨',  number: '04' },
  { id: 'yorumlar',   label: 'YORUMLAR',  ariaLabel: 'Yorumlar bölümüne git',      angle: 225, emoji: '💬',  number: '05' },
  { id: 'sss',        label: 'SORULAR',   ariaLabel: 'Sıkça sorulan sorular bölümüne git', angle: 270, emoji: '❓\uFE0F', number: '06' },
  { id: 'siparis',    label: 'SİPARİŞ',   ariaLabel: 'Sipariş ver bölümüne git',   angle: 315, highlight: true, emoji: '🎉', number: '07' },
] as const

// Runtime invariant: exactly 8 sections, each 45° apart, ids unique.
if (SECTIONS.length !== 8) {
  throw new Error(`SECTIONS must have exactly 8 entries, got ${SECTIONS.length}`)
}
const seen = new Set<string>()
for (let i = 0; i < SECTIONS.length; i++) {
  const expected = i * 45
  if (SECTIONS[i].angle !== expected) {
    throw new Error(`SECTIONS[${i}].angle must be ${expected}, got ${SECTIONS[i].angle}`)
  }
  if (seen.has(SECTIONS[i].id)) {
    throw new Error(`SECTIONS[${i}].id duplicate: ${SECTIONS[i].id}`)
  }
  seen.add(SECTIONS[i].id)
}

/** Convenience lookups */
export const SECTION_IDS = SECTIONS.map(s => s.id)
