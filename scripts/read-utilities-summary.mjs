// Per-unit averages from the utilities tracker.
import ExcelJS from 'exceljs';

const path = 'C:/Users/melin/Downloads/_Utilities Tracker.xlsx';
const wb = new ExcelJS.Workbook();
await wb.xlsx.readFile(path);
const ws = wb.getWorksheet('Trout');

const cellVal = (cell) => {
  let v = cell.value;
  if (v && typeof v === 'object' && 'result' in v) v = v.result;
  if (v && typeof v === 'object' && 'text' in v) v = v.text;
  return v;
};

// Walk rows finding "Unit N" labels followed by line items + Total row
const units = [];
let current = null;
for (let r = 1; r <= 200; r++) {
  const row = ws.getRow(r);
  const a = String(cellVal(row.getCell(1)) || '').trim();
  const b = String(cellVal(row.getCell(2)) || '').trim();
  const matchUnit = /^Unit\s+(\d+)/i.exec(a);
  if (matchUnit) {
    if (current) units.push(current);
    current = { unitNumber: matchUnit[1], rows: {} };
    continue;
  }
  if (b === 'Total Month:' && current) {
    const avg = Number(cellVal(row.getCell(15)));
    if (!Number.isNaN(avg)) current.rows.totalAvg = avg;
    continue;
  }
  if (current && a) {
    const avg = Number(cellVal(row.getCell(15)));
    if (!Number.isNaN(avg)) current.rows[a.toLowerCase()] = avg;
  }
}
if (current) units.push(current);

console.log('Per-unit average monthly utility cost (May 2025 → April 2026):\n');
console.log('Unit | Electrical | Trash | Water | Internet | TOTAL avg/mo');
console.log('-----|------------|-------|-------|----------|--------------');
for (const u of units.sort((a, b) => Number(a.unitNumber) - Number(b.unitNumber))) {
  const e = u.rows['electrical'] ?? 0;
  const t = u.rows['trash/disposal'] ?? 0;
  const w = u.rows['water'] ?? 0;
  const i = u.rows['internet'] ?? 0;
  const total = u.rows.totalAvg ?? (e + t + w + i);
  const f = (n) => `$${n.toFixed(2)}`.padStart(8);
  console.log(`  ${u.unitNumber}  | ${f(e)}    | ${f(t)} | ${f(w)} | ${f(i)}  | ${f(total)}`);
}

// Summary
const totals = units.map((u) => u.rows.totalAvg).filter((n) => !Number.isNaN(n));
const grand = totals.reduce((a, b) => a + b, 0);
console.log(`\nBuilding total: $${grand.toFixed(2)}/month avg ($${(grand * 12).toFixed(0)}/year)`);
console.log(`Avg per unit:   $${(grand / totals.length).toFixed(2)}/month`);
