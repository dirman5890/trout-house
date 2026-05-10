import ExcelJS from 'exceljs';
const wb = new ExcelJS.Workbook();
await wb.xlsx.readFile('C:/Users/melin/Downloads/_Utilities Tracker.xlsx');
const ws = wb.getWorksheet('Trout');

const cellVal = (cell) => {
  let v = cell.value;
  if (v && typeof v === 'object' && 'result' in v) v = v.result;
  if (v && typeof v === 'object' && 'text' in v) v = v.text;
  return v;
};

// Print only rows with content in column A or column B (skip empty)
for (let r = 1; r <= 100; r++) {
  const row = ws.getRow(r);
  const a = String(cellVal(row.getCell(1)) || '').trim();
  const b = String(cellVal(row.getCell(2)) || '').trim();
  if (a || b) {
    const avg = cellVal(row.getCell(15));
    console.log(`R${String(r).padStart(3)}: A="${a.slice(0, 30)}" B="${b.slice(0, 30)}" avg=${avg}`);
  }
}
