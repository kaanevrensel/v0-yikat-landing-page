// Fast, browser-free checks on the guide data that the converter writes (lib/guides/*,
// lib/care-sources.ts) and on the hand-written data that points into it. Run with
// `node --test tests/*.test.mjs`; the Playwright suite checks the rendered pages.
import test from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import { importTs } from "./helpers/import-ts.mjs"

const { careGuides, guideBySlug, guideRelease } = await importTs("lib/care-guides.ts")
const { careSources } = await importTs("lib/care-sources.ts")
const { guideTopics } = await importTs("lib/guide-topics.ts")
const { services } = await importTs("lib/services.ts")
const { serviceGuideLinks } = await importTs("lib/service-guide-links.ts")

const SERVICE_PAGES = ["/ayakkabi-temizleme", "/sneaker-yikama", "/suet-nubuk-temizleme", "/deri-ayakkabi-bakimi", "/bakirkoy-ayakkabi-temizleme"]
const ISO = /^\d{4}-\d{2}-\d{2}$/
const slugs = new Set(careGuides.map(guide => guide.slug))
const dupes = list => [...new Set(list.filter((x, i) => list.indexOf(x) !== i))]
const strings = (value, out = []) => {
  if (typeof value === "string") out.push(value)
  else if (Array.isArray(value)) value.forEach(v => strings(v, out))
  else if (value && typeof value === "object") Object.values(value).forEach(v => strings(v, out))
  return out
}
const sectionSources = guide => guide.sections.flatMap(section => section.sourceIds ?? [])
const guideLinks = guide => guide.sections.flatMap(section => (section.links ?? []).filter(link => link.type === "guide"))

test("every guide has a known topic of its own category, and the hub order groups topics in plan order", () => {
  const order = Object.keys(guideTopics)
  let last = -1
  for (const guide of careGuides) {
    assert.ok(guideTopics[guide.topic], `${guide.slug}: unknown topic "${guide.topic}"`)
    assert.equal(guideTopics[guide.topic].category, guide.category, `${guide.slug}: topic "${guide.topic}" is not a ${guide.category} topic`)
    const position = order.indexOf(guide.topic)
    assert.ok(position >= last, `${guide.slug}: topic "${guide.topic}" appears after a later topic; careGuides must follow hub order`)
    last = position
  }
  assert.deepEqual(dupes(Object.values(guideTopics).map(topic => topic.anchor)), [])
  for (const [label, topic] of Object.entries(guideTopics)) assert.match(topic.anchor, /^[a-z0-9]+(-[a-z0-9]+)*$/, label)
})

test("guide slugs, titles and descriptions are unique", () => {
  assert.deepEqual(dupes(careGuides.map(guide => guide.slug)), [])
  assert.deepEqual(dupes(careGuides.map(guide => guide.title.trim().toLocaleLowerCase("tr"))), [])
  assert.deepEqual(dupes(careGuides.map(guide => guide.description.trim().toLocaleLowerCase("tr"))), [])
  for (const guide of careGuides) assert.match(guide.slug, /^[a-z0-9]+(-[a-z0-9]+)*$/)
})

test("related guides and in-text guide links point to guides in this release", () => {
  for (const guide of careGuides) {
    assert.ok(guide.related.length > 0, `${guide.slug}: no related guides`)
    assert.deepEqual(dupes(guide.related), [], `${guide.slug}: duplicate related`)
    for (const slug of guide.related) {
      assert.ok(slugs.has(slug), `${guide.slug}: related ${slug} is not in careGuides`)
      assert.notEqual(slug, guide.slug, `${guide.slug}: related to itself`)
    }
    for (const link of guideLinks(guide)) {
      assert.ok(slugs.has(link.slug), `${guide.slug}: guide link to ${link.slug}, which is not in careGuides`)
      assert.notEqual(link.slug, guide.slug, `${guide.slug}: guide link to itself`)
      assert.ok(link.label.trim(), `${guide.slug}: guide link to ${link.slug} has no label`)
    }
  }
})

test("every cited source resolves to an https URL and section citations appear in the source list", () => {
  for (const guide of careGuides) {
    assert.ok(guide.sourceIds.length > 0, `${guide.slug}: no sources`)
    assert.deepEqual(dupes(guide.sourceIds), [], `${guide.slug}: duplicate source ids`)
    for (const id of [...guide.sourceIds, ...sectionSources(guide)]) assert.match(careSources[id]?.url ?? "", /^https:\/\/\S+$/, `${guide.slug}: source ${id}`)
    for (const id of sectionSources(guide)) assert.ok(guide.sourceIds.includes(id), `${guide.slug}: ${id} is cited in a section but missing from the source list (#kaynak-${id})`)
  }
  for (const [id, source] of Object.entries(careSources)) {
    assert.match(source.url, /^https:\/\/\S+$/, id)
    assert.ok(source.title.trim(), id)
  }
  for (const service of services) for (const id of [...service.sourceIds, service.afterCareSourceId]) assert.match(careSources[id]?.url ?? "", /^https:\/\//, `/${service.slug}: source ${id}`)
})

test("no guide, cited source title or hub intro uses the word tamir", () => {
  const has = text => text.toLocaleLowerCase("tr").includes("tamir")
  for (const guide of careGuides) {
    for (const text of strings(guide)) assert.ok(!has(text), `${guide.slug}: "${text.slice(0, 80)}"`)
    // Source titles render in full in the source list and by publisher in the "Kaynak:" lines.
    for (const id of guide.sourceIds) assert.ok(!has(careSources[id]?.title ?? ""), `${guide.slug}: source ${id} "${careSources[id]?.title}"`)
  }
  for (const [label, topic] of Object.entries(guideTopics)) assert.ok(!has(`${label} ${topic.intro}`), `lib/guide-topics.ts: ${label}`)
})

test("textile guides carry no shop or service links; shoe guides link only to shoe service pages", () => {
  for (const guide of careGuides) {
    const actions = guide.sections.flatMap(section => (section.links ?? []).filter(link => link.type !== "guide"))
    if (guide.category === "Tekstil") {
      assert.equal(guide.service, undefined, `${guide.slug}: textile guide with a service link`)
      assert.deepEqual(actions, [], `${guide.slug}: textile guide with photo or service links`)
    } else {
      for (const href of [guide.service?.href, ...actions.filter(link => link.type === "service").map(link => link.href)].filter(Boolean))
        assert.ok(SERVICE_PAGES.includes(href.split("#")[0]), `${guide.slug}: service link ${href}`)
    }
  }
})

test("everything the renderer keys on is unique within its list", () => {
  const reserved = new Set(["main", "kaynaklar", "faq-title", "sources-title"])
  for (const guide of careGuides) {
    const ids = guide.sections.map(section => section.id)
    assert.deepEqual(dupes(ids), [], `${guide.slug}: section ids`)
    for (const id of ids) assert.ok(/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id) && !reserved.has(id) && !id.startsWith("kaynak-"), `${guide.slug}: section id ${id}`)
    assert.deepEqual(dupes(guide.faqs.map(faq => faq.q)), [], `${guide.slug}: FAQ questions`)
    for (const section of guide.sections) {
      const at = `${guide.slug}#${section.id}`
      for (const list of ["paragraphs", "steps", "sourceIds"]) assert.deepEqual(dupes(section[list] ?? []), [], `${at}: ${list}`)
      const keys = (section.links ?? []).map(link => link.type === "guide" ? `guide:${link.slug}` : link.type === "service" ? `service:${link.href}` : `photo:${link.label}`)
      assert.deepEqual(dupes(keys), [], `${at}: links`)
      if (section.table) {
        assert.deepEqual(dupes(section.table.headings), [], `${at}: table headings`)
        assert.deepEqual(dupes(section.table.rows.map(row => row[0])), [], `${at}: first cells of table rows`)
        for (const row of section.table.rows) assert.equal(row.length, section.table.headings.length, `${at}: row "${row[0]}"`)
      }
    }
  }
})

test("release dates are consistent: new guides published on the release date, rewrites updated on it, publication dates kept", () => {
  assert.match(guideRelease.date, ISO)
  assert.match(guideRelease.hubUpdated, ISO)
  assert.ok(guideRelease.hubUpdated <= guideRelease.date, "/rehber lastmod after the release date")
  if (guideRelease.added.length) assert.equal(guideRelease.hubUpdated, guideRelease.date, "a release that adds guides changes the /rehber list")
  const listed = [...guideRelease.added, ...guideRelease.rewritten, ...guideRelease.keptLive]
  assert.deepEqual(dupes(listed), [])
  assert.deepEqual([...listed].sort(), [...slugs].sort(), "every guide is either added, rewritten or kept as live")
  for (const guide of careGuides) {
    for (const date of [guide.published, guide.updated].filter(Boolean)) assert.match(date, ISO, guide.slug)
    if (guide.published && guide.updated) assert.ok(guide.updated >= guide.published, `${guide.slug}: updated before published`)
    assert.ok((guide.updated ?? guide.published ?? "") <= guideRelease.date, `${guide.slug}: dated after the release`)
  }
  for (const slug of guideRelease.added) { assert.equal(guideBySlug(slug).published, guideRelease.date, slug); assert.equal(guideBySlug(slug).updated, undefined, slug) }
  for (const slug of guideRelease.rewritten) assert.equal(guideBySlug(slug).updated, guideRelease.date, slug)
})

test("keyword map rows target only guides in this release", () => {
  // docs/seo/*.csv: a row retargeted to a planned guide waits until the release that ships it.
  const dir = path.join(import.meta.dirname, "../docs/seo")
  for (const file of fs.readdirSync(dir).filter(f => f.endsWith(".csv")))
    for (const [i, line] of fs.readFileSync(path.join(dir, file), "utf8").split("\n").entries())
      for (const [, slug] of line.matchAll(/\/rehber\/([a-z0-9-]+)/g)) assert.ok(slugs.has(slug), `docs/seo/${file} line ${i + 1}: /rehber/${slug} is not in this release`)
})

test("hand-written links into the guides resolve", () => {
  for (const service of services) for (const slug of [service.guideSlug, ...service.relatedGuides]) assert.ok(slugs.has(slug), `/${service.slug}: ${slug}`)
  for (const [path, row] of Object.entries(serviceGuideLinks)) {
    assert.ok(SERVICE_PAGES.includes(path), path)
    assert.deepEqual(dupes(row), [], path)
    for (const slug of row) assert.match(slug, /^[a-z0-9]+(-[a-z0-9]+)*$/, `${path}: ${slug}`)
    // Rows list planned guides too; the page renders only released ones. Each row keeps at least one live target.
    assert.ok(row.some(slug => slugs.has(slug)), `${path}: no guide of its row is in the release`)
  }
  for (const slug of ["ayakkabi-makinede-yikanir-mi", "ayakkabi-kuru-temizlemeye-verilir-mi"]) assert.ok(slugs.has(slug), `home and /bakirkoy-ayakkabi-temizleme link ${slug}`)
})
