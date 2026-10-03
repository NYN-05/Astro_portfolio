export function formatDate(dateStr: string, month: 'short' | 'long' = 'short'): string {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month });
}
