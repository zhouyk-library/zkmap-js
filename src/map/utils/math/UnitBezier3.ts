export default class UnitBezier3{
  private cx:number;
  private bx:number;
  private ax:number;
  private cy:number;
  private by:number;
  private ay:number;
  constructor(p1x:number, p1y:number, p2x:number, p2y:number){
    // B(t) = P0*(1-t)^3 + 3*P1*t*(1-t)^2 + 3*P2*t^2*(1-t) + P3*t^3
    // P0 = (0, 0)   P1 = (p1x, p1y)   P2 = (p2x, p2y)   P3 = (1, 1)
    this.cx = 3.0 * p1x;
    this.bx = 3.0 * (p2x - p1x) - this.cx;
    this.ax = 1.0 - this.cx - this.bx;
    this.cy = 3.0 * p1y;
    this.by = 3.0 * (p2y - p1y) - this.cy;
    this.ay = 1.0 - this.cy - this.by;
  }
  private sampleCurveX(t:number):number {
    // ax t^3 + bx t^2 + cx t
    return ((this.ax * t + this.bx) * t + this.cx) * t;
  }
  private sampleCurveY(t:number):number {
    // ay t^3 + by t^2 + cy t
    return ((this.ay * t + this.by) * t + this.cy) * t;
  }
  private sampleCurveDerivativeX(t:number):number {
    return (3.0 * this.ax * t + 2.0 * this.bx) * t + this.cx;
  }
  private solveCurveX(t:number,epsilon?:number):number{
    if (typeof epsilon === 'undefined') epsilon = 1e-6;
    var t0,t1,t2,x2,i;
    for (t2 = t, i = 0; i < 8; i++) {
        x2 = this.sampleCurveX(t2) - t;
        if (Math.abs(x2) < epsilon) return t2;
        var d2 = this.sampleCurveDerivativeX(t2);
        if (Math.abs(d2) < 1e-6) break;
        t2 = t2 - x2 / d2;
    }
    
    // 二分法求贝塞尔值
    if (t2 < t0) return t0;
    if (t2 > t1) return t1;
    while (t0 < t1) {
        x2 = this.sampleCurveX(t2);
        if (Math.abs(x2 - t2) < 1e-6) return t2;
        if (t2 > x2) {
            t0 = t2;
        } else {
            t1 = t2;
        }
        t2 = (t1 - t0) * 0.5 + t0;
    }
    return t2;
  }
  public solve(x:number):number {
    return this.sampleCurveY(this.solveCurveX(x));
  }
}