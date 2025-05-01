import * as fs from 'fs'
import * as path from 'path'
import { parse } from "csv-parse/sync";
import chardet from "chardet";
import iconv from "iconv-lite";

export function parseCustomDate(dateStr: string) {
  if (typeof dateStr !== "string") return null;

  // Remove leading single quote if present
  const cleaned = dateStr.replace(/^'/, "").replace(" ", "T");

  const date = new Date(cleaned);

  // Check for invalid date
  return isNaN(date.getTime()) ? null : date;
}


type CSVRow = Record<string, string>

export function readCSVFile(filePath: string): CSVRow[] {
  const absolutePath = path.resolve(filePath)
  const fileContent = fs.readFileSync(absolutePath, 'utf-8')
  
  const lines = fileContent.trim().split('\n')
  const headers = lines[0].split(',')

  const rows: CSVRow[] = lines.slice(1).map(line => {
    const values = line.split(',')
    const row: CSVRow = {}

    headers.forEach((header, index) => {
      row[header.trim()] = values[index]?.trim() ?? ''
    })

    return row
  })

  return rows
}


export function readCsvToArray(filePath: string): Record<string, any>[] {
  const encoding = chardet.detect(fs.readFileSync(filePath)) || "utf-8";
  const fileBuffer = fs.readFileSync(filePath);
  const fileContent = iconv.decode(fileBuffer, encoding).replace(/^\ufeff/, "");

  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
    trim: true,
  });

  return records;
}