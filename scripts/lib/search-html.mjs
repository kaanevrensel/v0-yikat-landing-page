// Static server-HTML inspection. This does not render JavaScript or prove Google indexing.
export function decodeEntities(text) {
  const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
  return text.replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (entity, key) => {
    if (!key.startsWith('#')) return named[key.toLowerCase()];
    const number = key[1].toLowerCase() === 'x' ? parseInt(key.slice(2), 16) : Number(key.slice(1));
    return number > 0 && number <= 0x10ffff && !(number >= 0xd800 && number <= 0xdfff) ? String.fromCodePoint(number) : entity;
  });
}
export function textContent(text) { return decodeEntities(text.replace(/<(?:[^>"']|"[^"]*"|'[^']*')+>/g, ' ')).replace(/\s+/g, ' ').trim(); }
export function attributes(tag) {
  const attrs = {};
  const body = tag.replace(/^<\/?[\w:-]+/, '').replace(/\/?\s*>$/, '');
  const pattern = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  for (const match of body.matchAll(pattern)) {
    const name = match[1].toLowerCase();
    if (!(name in attrs)) attrs[name] = decodeEntities(match[2] ?? match[3] ?? match[4] ?? '');
  }
  return attrs;
}
export function normalizeUrl(value, base) {
  try {
    const url = new URL(value, base);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return null;
    url.hash = '';
    return url.href;
  } catch { return null; }
}
export function robotDirectives(header = '') {
  // Each header value can be unscoped or agent-scoped. Do not apply Googlebot-News to Googlebot.
  const directives = [];
  let agent = null;
  for (let token of header.toLowerCase().split(',')) {
    token = token.trim();
    const scope = token.match(/^([\w*-]+)\s*:\s*(.*)$/);
    if (scope && !['max-snippet', 'max-image-preview', 'max-video-preview', 'unavailable_after'].includes(scope[1])) {
      agent = scope[1]; token = scope[2];
    }
    if (!agent || agent === '*' || agent === 'googlebot') directives.push(...token.split(/[\s;]+/).filter(Boolean));
  }
  return directives;
}
export function inspectHtml(html, url, xRobots = '') {
  // Script JSON/React payloads and comments must never count as visible tags or links.
  const clean = html.replace(/<!--[\s\S]*?-->/g, '').replace(/<(script|style|template)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '');
  const tags = [...clean.matchAll(/<([a-z][\w:-]*)\b(?:[^>"']|"[^"]*"|'[^']*')*>/gi)].map(m => ({ tag: m[1].toLowerCase(), attrs: attributes(m[0]) }));
  const baseHref = tags.find(t => t.tag === 'base' && t.attrs.href)?.attrs.href;
  const base = baseHref ? normalizeUrl(baseHref, url) || url : url;
  const metas = tags.filter(t => t.tag === 'meta').map(t => t.attrs);
  const directives = [...robotDirectives(xRobots), ...metas.filter(m => ['robots', 'googlebot'].includes(m.name?.toLowerCase())).flatMap(m => robotDirectives(m.content))];
  const canonicals = tags.filter(t => t.tag === 'link' && t.attrs.rel?.toLowerCase().split(/\s+/).includes('canonical')).map(t => ({ raw: t.attrs.href ?? '', url: t.attrs.href ? normalizeUrl(t.attrs.href, base) : null }));
  const titles = [...clean.matchAll(/<title\b(?:[^>"']|"[^"]*"|'[^']*')*>([\s\S]*?)<\/title\s*>/gi)].map(m => textContent(m[1]));
  const h1 = [...clean.matchAll(/<h1\b(?:[^>"']|"[^"]*"|'[^']*')*>([\s\S]*?)<\/h1\s*>/gi)].map(m => textContent(m[1]));
  const links = tags.filter(t => t.tag === 'a' && t.attrs.href).map(t => ({ url: normalizeUrl(t.attrs.href, base), nofollow: t.attrs.rel?.toLowerCase().split(/\s+/).includes('nofollow') || false })).filter(l => l.url);
  return { titles, h1, description: metas.filter(m => m.name?.toLowerCase() === 'description').map(m => m.content || ''), canonicals, directives, noindex: directives.includes('noindex') || directives.includes('none'), nofollow: directives.includes('nofollow') || directives.includes('none'), links };
}
function completeXmlRoot(xml) {
  const stack = [];
  let root = null, end = 0;
  const malformed = () => { throw new Error('Malformed or incomplete sitemap XML'); };
  const checkText = text => { if (text.includes('<') || (!stack.length && text.trim())) malformed(); };
  const tokens = /<!--[\s\S]*?-->|<!\[CDATA\[[\s\S]*?\]\]>|<\?[\s\S]*?\?>|<\/?[A-Za-z_][\w:.-]*(?:[^>"']|"[^"]*"|'[^']*')*>/g;
  for (const match of xml.matchAll(tokens)) {
    checkText(xml.slice(end, match.index));
    const token = match[0]; end = match.index + token.length;
    if (token.startsWith('<!--') || token.startsWith('<?')) continue;
    if (token.startsWith('<![CDATA[')) { if (!stack.length) malformed(); continue; }
    if (token.startsWith('</')) {
      const closing = /^<\/([A-Za-z_][\w:.-]*)\s*>$/.exec(token);
      if (!closing || stack.pop() !== closing[1]) malformed();
    } else {
      const opening = /^<([A-Za-z_][\w:.-]*)(?:\s+[A-Za-z_][\w:.-]*\s*=\s*(?:"[^"<]*"|'[^'<]*'))*\s*\/?>$/.exec(token);
      if (!opening) malformed();
      if (!stack.length) { if (root) malformed(); root = opening[1]; }
      if (!/\/\s*>$/.test(token)) stack.push(opening[1]);
    }
  }
  checkText(xml.slice(end));
  if (stack.length || !root) malformed();
  return root;
}
export function parseSitemap(xml, base) {
  if (/<!DOCTYPE|<!ENTITY/i.test(xml)) throw new Error('Sitemap DTD/entities are unsupported');
  const root = completeXmlRoot(xml).toLowerCase();
  if (!['urlset', 'sitemapindex'].includes(root)) throw new Error('Not a sitemap urlset or index');
  const content = xml.replace(/<!--[\s\S]*?-->|<\?[\s\S]*?\?>/g, '');
  const entryTag = root === 'urlset' ? 'url' : 'sitemap';
  const urls = [...content.matchAll(new RegExp(`<${entryTag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${entryTag}\\s*>`, 'gi'))].map(m => {
    const loc = /<loc(?:\s[^>]*)?>([\s\S]*?)<\/loc\s*>/i.exec(m[1])?.[1];
    if (!loc) throw new Error('Sitemap entry has no loc');
    const value = decodeEntities(loc.replace(/^\s*<!\[CDATA\[([\s\S]*)\]\]>\s*$/, '$1').trim());
    const url = normalizeUrl(value, base);
    if (!url || !/^https?:\/\//i.test(value)) throw new Error('Sitemap loc must be an absolute HTTP(S) URL');
    return url;
  });
  return { type: root, urls };
}
export function parseRobots(text) {
  const groups = [];
  let group = null;
  for (const line of text.split(/\r?\n/)) {
    const match = line.replace(/#.*/, '').trim().match(/^([\w-]+)\s*:\s*(.*)$/);
    if (!match) continue;
    const key = match[1].toLowerCase(), value = match[2].trim();
    if (key === 'user-agent') {
      if (!group || group.hasRules) { group = { agents: [], rules: [], hasRules: false }; groups.push(group); }
      group.agents.push(value.toLowerCase());
    } else if (group && ['allow', 'disallow'].includes(key)) {
      group.hasRules = true;
      if (value) group.rules.push({ allow: key === 'allow', pattern: value });
    }
  }
  return groups;
}
export function robotsAllows(groups, input, agent = 'googlebot') {
  const matches = groups.flatMap(group => group.agents.filter(a => a === '*' || agent.toLowerCase().includes(a)).map(a => ({ group, specificity: a === '*' ? 0 : a.length })));
  if (!matches.length) return true;
  const specificity = Math.max(...matches.map(m => m.specificity));
  const url = new URL(input);
  const path = url.pathname + url.search;
  const rules = matches.filter(m => m.specificity === specificity).flatMap(m => m.group.rules).filter(rule => {
    const end = rule.pattern.endsWith('$');
    const pattern = (end ? rule.pattern.slice(0, -1) : rule.pattern).split('*').map(v => v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*');
    return new RegExp(`^${pattern}${end ? '$' : ''}`).test(path);
  }).sort((a, b) => b.pattern.replace(/[*$]/g, '').length - a.pattern.replace(/[*$]/g, '').length || Number(b.allow) - Number(a.allow));
  return rules.length ? rules[0].allow : true;
}
