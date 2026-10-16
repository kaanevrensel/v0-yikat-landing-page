// The native API returns one aggregate row so a provider row limit cannot
// silently truncate the daily buckets. Counts still verify completeness.
export function counterRowsFromEnvelope(value) {
  if (!Array.isArray(value) || value.length !== 1 || Object.keys(value[0] || {}).join(',') !== 'report') throw new Error('Unexpected native aggregate envelope');
  const report = value[0].report;
  if (!report || Object.keys(report).sort().join(',') !== 'eventCount,rowCount,rows' || !Array.isArray(report.rows)
    || !Number.isSafeInteger(report.rowCount) || report.rowCount < 0 || !Number.isSafeInteger(report.eventCount) || report.eventCount < 0
    || report.rowCount !== report.rows.length || report.rows.some(row => !Number.isSafeInteger(row.events) || row.events < 1)
    || report.eventCount !== report.rows.reduce((sum, row) => sum + row.events, 0)) throw new Error('Incomplete or inconsistent native aggregate; no report written');
  return report.rows;
}
