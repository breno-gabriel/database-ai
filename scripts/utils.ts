export function parseCustomDate(dateStr: string) {
  if (typeof dateStr !== "string") return null;

  // Remove leading single quote if present
  const cleaned = dateStr.replace(/^'/, "").replace(" ", "T");

  const date = new Date(cleaned);

  // Check for invalid date
  return isNaN(date.getTime()) ? null : date;
}
