/**
 * Business Logic Shared Calculations Utility Functions
 */

export function calculatePercentage(part: number, total: number): number {
  if (!total) return 0;
  return Math.round((part / total) * 100);
}

export function calculateAverage(numbers: number[]): number {
  if (!numbers.length) return 0;
  const sum = numbers.reduce((a, b) => a + b, 0);
  return Number((sum / numbers.length).toFixed(1));
}

export function sortByField<T>(items: T[], field: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
  return [...items].sort((a, b) => {
    const valA = a[field];
    const valB = b[field];
    
    if (valA === valB) return 0;
    if (valA === undefined || valA === null) return 1;
    if (valB === undefined || valB === null) return -1;
    
    const comparison = valA < valB ? -1 : 1;
    return order === 'asc' ? comparison : -comparison;
  });
}
