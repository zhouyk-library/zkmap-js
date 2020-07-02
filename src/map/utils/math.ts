import UnitBezier from './math/UnitBezier3'
export function bezier(p1x: number, p1y: number, p2x: number, p2y: number): (t: number) => number {
  const bezier:UnitBezier = new UnitBezier(p1x, p1y, p2x, p2y);
  return function(t: number) {
      return bezier.solve(t);
  };
}
export const ease = bezier(0.25, 0.1, 0.25, 1);