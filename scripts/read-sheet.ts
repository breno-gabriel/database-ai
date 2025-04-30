/* eslint-disable @typescript-eslint/no-explicit-any */
import * as chardet from "chardet";
import * as fs from "fs";
import * as iconv from "iconv-lite";
import * as XLSX from "xlsx";

export function readCsvToArray(filePath: string): Record<string, any>[] {
  // Detect file encoding
  const encoding = chardet.detect(fs.readFileSync(filePath)) || "utf-8";

  // Read the file content with detected encoding
  const fileBuffer = fs.readFileSync(filePath);
  const fileContent = iconv.decode(fileBuffer, encoding);

  // Remove BOM if present
  const cleanContent = fileContent.replace(/^\ufeff/, "");

  // Split content into lines
  const lines = cleanContent
    .split("\n")
    .map((line: string) => line.trim())
    .filter((line: string) => line);

  // Helper to remove surrounding double quotes if present
  const unquote = (str: string) => str.replace(/^"(.*)"$/, "$1");

  // Extract headers
  const headers = lines[0]
    .split(/\t|,/)
    .map((header: string) => unquote(header.trim()));

  // Map lines to objects
  const jsonData = lines.slice(1).map((line: string) => {
    const values = line.split(/\t|,/).map((value) => unquote(value.trim()));
    return headers.reduce(
      (obj: { [x: string]: string }, header: string, index: number) => {
        obj[header] = values[index] || "";
        return obj;
      },
      {} as Record<string, any>
    );
  });

  return jsonData;
}

export function readSheet(
  sheetNumber: number,
  filePath: string
): Record<string, any>[] {
  const fileBuffer = fs.readFileSync(filePath);

  // Parse workbook
  const workbook = XLSX.read(fileBuffer, { type: "buffer" });

  // Check if the workbook has at least 3 sheets

  console.log(workbook.SheetNames);
  // Get the third sheet (index 2, since arrays are zero-based)
  const thirdSheetName = workbook.SheetNames[sheetNumber];
  const worksheet = workbook.Sheets[thirdSheetName];

  // Convert to JSON
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 0 });

  return jsonData as Record<string, any>[];
}
