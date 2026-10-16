import test from 'node:test';
import assert from 'node:assert/strict';
import { counterRowsFromEnvelope } from '../scripts/lib/contact-counter-report.mjs';

test('explicit native zero is distinct from missing or truncated aggregate results', () => {
  assert.deepEqual(counterRowsFromEnvelope([{ report: { rowCount: 0, eventCount: 0, rows: [] } }]), []);
  for (const value of [[], null, [{ report: { rowCount: 1, eventCount: 0, rows: [] } }], [{ report: { rowCount: 0, eventCount: 7, rows: [] } }]]) assert.throws(() => counterRowsFromEnvelope(value));
});
test('large bucket set is checked against server count and event sum', () => {
  const rows = Array.from({ length: 1500 }, () => ({ events: 2 }));
  assert.equal(counterRowsFromEnvelope([{ report: { rowCount: 1500, eventCount: 3000, rows } }]).length, 1500);
  assert.throws(() => counterRowsFromEnvelope([{ report: { rowCount: 1500, eventCount: 3000, rows: rows.slice(0, 1000) } }]));
  assert.throws(() => counterRowsFromEnvelope([{ report: { rowCount: 1500, eventCount: 3001, rows } }]));
});
