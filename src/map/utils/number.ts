export function isNumber(val?: any): boolean {
  return (typeof val === 'number') && !isNaN(val);
}
export function isInteger(n: number): boolean {
  return (n | 0) === n;
}