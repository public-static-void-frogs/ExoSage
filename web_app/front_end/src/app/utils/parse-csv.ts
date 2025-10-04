import { parse, ParseResult } from "papaparse";
import { AlignedData } from "uplot";

export interface ParsedPoint {
  x: number;
  y: number | null;
}

export type ParsedCsvResult = ParsedPoint[][];

export const parseCsv = (file: File): Promise<AlignedData[]> => {
  return new Promise((resolve, reject) => {
    parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results: ParseResult<Record<string, unknown>>) => {
        try {
          const rows = results.data;
          if (rows.length === 0) {
            reject(new Error("No data found in CSV file"));
            return;
          }

          const fields = results.meta.fields;
          if (!fields || fields.length === 0) {
            reject(new Error("No columns found in CSV file"));
            return;
          }

          const allRows: ParsedCsvResult = new Array(rows.length);

          for (let r = 0; r < rows.length; r++) {
            const row = rows[r];
            const points: ParsedPoint[] = new Array(fields.length);

            for (let i = 0; i < fields.length; i++) {
              const key = fields[i]!;
              const raw = row[key];
              let y: number | null = null;

              if (typeof raw === "number") {
                y = isNaN(raw) ? null : raw;
              } else if (typeof raw === "string" && raw.length > 0) {
                const parsed = Number(raw);
                y = isNaN(parsed) ? null : parsed;
              }

              points[i] = { x: i, y };
            }

            allRows[r] = points;
          }

          const alignedData = allRows.map((points) => {
            const x = points.map((p) => p.x);
            const y = points.map((p) => (p.y !== null ? p.y : NaN));
            return [x, y] as [number[], (number | null)[]];
          });

          resolve(alignedData);
        } catch (err) {
          reject(
            err instanceof Error ? err : new Error("Error processing CSV")
          );
        }
      },
      error: (err) => {
        reject(new Error(`Error reading CSV: ${err.message}`));
      },
    });
  });
};
