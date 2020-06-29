
import { Transform, Projection, Bound, Constant } from '../geo/types';
import { Painter } from './types';
export default class Render {
  private _transform: Transform;
  private _ctx: CanvasRenderingContext2D;
  private _painter: Painter;
  constructor(transform: Transform) {
    this._transform = transform
    if (transform.context.isCtx) {
      this._ctx = transform.context.ctx
    }
    this._painter = new Painter(this._ctx, this._transform);
  }
  render() {
    const screenBound: Bound = this._transform.screenBound
    const ctx = this._ctx
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.lineWidth = 1
    ctx.fillStyle = "#f0f0f0";
    ctx.beginPath();
    ctx.fillRect(screenBound.xmin, screenBound.ymin, screenBound.xmax - screenBound.xmin, screenBound.ymax - screenBound.ymin);
    ctx.closePath()
    ctx.stroke();
    ctx.restore();
    this._painter.render();
  }
  computed() {
    this._painter.computed();
  }
}