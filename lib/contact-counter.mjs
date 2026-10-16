export const COUNTER_SCHEMA = 2;
export const COUNTER_ACTIONS = ['whatsapp', 'call', 'directions'];
export const COUNTER_REFERRERS = ['google', 'bing', 'chatgpt', 'other_ai', 'internal', 'other', 'direct_or_unknown'];
export const COUNTER_PAGES = [
  '/', '/urun', '/partnerler', '/ayakkabi-temizleme', '/bakirkoy-ayakkabi-temizleme',
  '/rehber', '/rehber/*', '/sneaker-yikama', '/suet-nubuk-temizleme', '/deri-ayakkabi-bakimi',
  '/kvkk', '/kullanim-kosullari', '/odeme-ve-guvenli-alisveris', '/kvkk-basvuru-formu',
  '/acik-riza-metni', '/kart-saklama-metni', '/mesafeli-satis-sozlesmesi',
  '/gizlilik-politikasi', '/hesap-silme', '/teslimat-ve-iade', '/iletisim', 'other',
];

// Called only after existing contactProperties has removed arbitrary paths.
// All guide pages share one stable bucket; no personal or variable URL survives.
export function counterPayload(properties) {
  const page = COUNTER_PAGES.includes(properties.page) ? properties.page
    : /^\/rehber\/[a-z0-9-]+$/.test(properties.page) ? '/rehber/*' : 'other';
  return { schema: COUNTER_SCHEMA, action: properties.action, page, referrer: properties.referrer };
}

export function validCounterPayload(value) {
  return Boolean(value && !Array.isArray(value) && typeof value === 'object'
    && Object.keys(value).sort().join(',') === 'action,page,referrer,schema'
    && value.schema === COUNTER_SCHEMA && COUNTER_ACTIONS.includes(value.action)
    && COUNTER_PAGES.includes(value.page) && COUNTER_REFERRERS.includes(value.referrer));
}
