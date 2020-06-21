export function wrap(n: number, min: number, max: number): number {
  const d = max - min;
  const w = ((n - min) % d + d) % d + min;
  return (w === min) ? max : w;
}
