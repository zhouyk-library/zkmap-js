export default class Bound {
  private _xmin: number;
  private _ymin: number;
  private _xmax: number;
  private _ymax: number;
  private _xscale: number = 1;
  private _yscale: number = 1;

  get xmin():number {
      return this._xmin;
  }
  get ymin():number {
      return this._ymin;
  }
  get xmax():number {
      return this._xmax;
  }
  get ymax():number {
      return this._ymax;
  }
  get xscale():number {
      return this._xscale;
  }
  get yscale():number {
      return this._yscale;
  }
  containX(x:number):boolean{
    return this._xmin * this._xscale <= x && this._xmax * this._xscale >= x;
  }
  containY(y:number):boolean{
    return this._ymin * this._xscale <= y && this._ymax * this._xscale >= y;
  }
  constructor(xmin, ymin, xmax, ymax) {
      this._xmin = Math.min(xmin, xmax);
      this._ymin = Math.min(ymin, ymax);
      this._xmax = Math.max(xmin, xmax);
      this._ymax = Math.max(ymin, ymax);
      this._xscale = xmin <= xmax ? 1 : -1;
      this._yscale = ymin <= ymax ? 1 : -1;
  }
}