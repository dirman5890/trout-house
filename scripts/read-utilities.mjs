// Dump the Trout House utilities tracker so we can analyze pricing strategy.
import ExcelJS from 'exceljs';

const path = 'C:/Users/melin/Downloads/_Utilities Tracker.xlsx';
const wb = new ExcelJS.Workbook();
await wb.xlsx.readFile(path);

const skip = new Set(['Golden', 'Royal']);

for (const ws of wb.worksheets) {
  if ([...skip].some((n) => ws.name.toLowerCase().includes(n.toLowerCase()))) {
    console.log(`-- skipping ${ws.name} --\n`);
    continue;
  }
  console.log(`========== ${ws.name} (${ws.rowCount} rows × ${ws.columnCount} cols) ==========`);
  ws.eachRow({ includeEmpty: false }, (row, rowIdx) => {
    const cells = [];
    row.eachCell({ includeEmpty: true }, (cell) => {
      let v = cell.value;
      if (v && typeof v === 'object' && 'result' in v) v = v.result;
      if (v && typeof v === 'object' && 'text' in v) v = v.text;
      if (v instanceof Date) v = v.toISOString().slice(0, 10);
      cells.push(v ?? '');
    });
    console.log(`R${rowIdx}: ${cells.map((c) => String(c).slice(0, 30)).join(' | ')}`);
  });
  console.log('');
}
