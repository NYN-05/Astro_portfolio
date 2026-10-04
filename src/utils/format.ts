export function formatDate(
  dateStr: string,
  month: "short" | "long" = "short",
): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return "Invalid date";
  }
  return date.toLocaleDateString("en-US", { year: "numeric", month });
}
