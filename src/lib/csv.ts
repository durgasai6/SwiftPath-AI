export function parseCsvText(text: string) {
  const normalizedText = String(text || "").replace(/\r\n/g, "\n").trim();

  if (!normalizedText) return [];

  const rows: string[][] = [];
  let currentCell = "";
  let currentRow: string[] = [];
  let inQuotes = false;

  for (let index = 0; index < normalizedText.length; index += 1) {
    const character = normalizedText[index];
    const nextCharacter = normalizedText[index + 1];

    if (character === '"') {
      if (inQuotes && nextCharacter === '"') {
        currentCell += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }

      continue;
    }

    if (character === "," && !inQuotes) {
      currentRow.push(currentCell);
      currentCell = "";
      continue;
    }

    if (character === "\n" && !inQuotes) {
      currentRow.push(currentCell);
      rows.push(currentRow);
      currentCell = "";
      currentRow = [];
      continue;
    }

    currentCell += character;
  }

  currentRow.push(currentCell);
  rows.push(currentRow);

  const nonEmptyRows = rows.filter((row) => row.some((cell) => cell.trim() !== ""));
  if (!nonEmptyRows.length) return [];

  const [headerRow, ...dataRows] = nonEmptyRows;
  const headers = headerRow.map((header) =>
    header
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
  );

  return dataRows.map((row) =>
    headers.reduce<Record<string, string>>((record, header, index) => {
      record[header] = String(row[index] || "").trim();
      return record;
    }, {})
  );
}

