/**
 * Central site configuration — Brief 7.1.
 * App store URLs are placeholders until the app ships (Brief §9.6 fallback);
 * swap these once the listings are live.
 */
export const siteConfig = {
  name: 'YIKAT',
  phone: '0850 303 31 93',
  phoneHref: 'tel:+908503033193',
  email: 'destek@yikat.tech',
  // Footer-only WhatsApp support line (Brief §3, §7.2). Not an order channel.
  whatsappSupportUrl:
    'https://wa.me/908503033193?text=Merhaba%2C%20destek%20almak%20istiyorum.',
  appStoreUrl: 'https://apps.apple.com/tr/app/yikat/',
  playStoreUrl: 'https://play.google.com/store/apps/details?id=tech.yikat',
} as const

/** Conservative, claimable trust numbers (Brief §5.3 — do not inflate). */
export const trustStats = [
  { value: '1.500+', label: 'tamamlanan sipariş' },
  { value: '12+', label: 'partner kuru temizlemeci' },
  { value: '18+', label: 'mahallede hizmet' },
  { value: '400+', label: 'memnun müşteri' },
] as const
