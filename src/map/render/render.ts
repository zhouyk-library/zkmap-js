
import { Transform, Projection, Bound, Constant } from '../geo/types';
import { Painter } from './types';
import { loadAjax } from './ajax'
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
  // drawLngLatLine() {
  //   const ctx = this._ctx
  //   const screenBound: Bound = this._transform.screenBound
  //   const allCount = Math.pow(2, this._transform.zoom)
  //   const outXEnd = this._transform.width, outXStart = 0, outYEnd = this._transform.height, outYStart = 0
  //   const inXStart = screenBound.xmin, inYStart = screenBound.ymin, inXEnd = screenBound.xmax, inYEnd = screenBound.ymax

  //   const countX = inXEnd - inXStart
  //   const countY = inYEnd - inYStart
  //   var xstart = Math.floor(allCount / countX * (Math.max(inXStart, outXStart) - inXStart))
  //   var xend = Math.ceil(allCount / countX * (Math.min(inXEnd, outXEnd) - inXStart))
  //   var ystart = Math.floor(allCount / countY * (Math.max(inYStart, outYStart) - inYStart))
  //   var yend = Math.ceil(allCount / countY * (Math.min(inYEnd, outYEnd) - inYStart))
  //   console.log({ xstart, xend, ystart, yend })
  //   for (let inexx = xstart; inexx < xend; inexx++) {
  //     for (let inexy = ystart; inexy < yend; inexy++) {
  //       const screenX = inexx * 256 + inXStart;
  //       const screenY = inexy * 256 + inYStart;
  //       this.loadImage(this._transform.zoom, inexx, inexy, screenX, screenY).then(res => {
  //         ctx.save();
  //         ctx.setTransform(1, 0, 0, 1, 0, 0);
  //         ctx.beginPath();
  //         ctx.strokeStyle = "#ff9999";
  //         ctx.fillStyle = "#ff9999";
  //         ctx.lineWidth = 1
  //         ctx.rect(screenX, screenY, 256, 256);
  //         ctx.font = `${30}px Verdana`;
  //         ctx.fillText(`(${this._transform.zoom},${inexx},${inexy})`, screenX + 20, screenY + 130, 200);
  //         ctx.closePath()
  //         ctx.stroke();
  //         ctx.restore();
  //       })
  //     }
  //   }
  // }
  // loadImage(z, x, y, offsetX, offsetY) {
  //   return new Promise((resolve, reject) => {
  //     loadAjax(z, x, y).then(res => {
  //       this._ctx.save();
  //       this._ctx.setTransform(1, 0, 0, 1, 0, 0);
  //       this._ctx.drawImage(res, offsetX, offsetY, 256, 256);
  //       this._ctx.restore();
  //       resolve()
  //     }).catch(e => { })
  //   })
  // }
}