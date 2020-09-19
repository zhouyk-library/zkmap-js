import { Transform, Projection, Bound, Constant } from '../geo/types';
import { TilesCache, Tile } from '../tiles/types';
import { Map } from '../main/types';
import Utils from '../utils';
import { Paint, PointPaint } from './types';
export default class Painter {
  private _map: Map;
  private _transform: Transform;
  private _ctx: CanvasRenderingContext2D;
  constructor(ctx: CanvasRenderingContext2D, map: Map) {
    this._map = map;
    this._transform = this._map.transform
    this._ctx = ctx
  }
  draw(paint: Paint, coordinates: number[][]) {
    if (!(paint || paint.point || paint.line || paint.polygon)) {
      this.drawPoint(coordinates, { fillStyle: 'red', radius: 1, opacity: 1 })
    }
    if (paint.polygon) {
    }
    if (paint.line) {

    }
    if (paint.point) {
      this.drawPoint(coordinates, paint.point)
    }
  }
  drawPoint(coordinates: number[][], pointpaint: PointPaint) {
    coordinates.forEach(coordinate => {
      this._ctx.save();
      this._ctx.globalAlpha = pointpaint.opacity || 1;
      this._ctx.strokeStyle = pointpaint.strokeStyle;
      this._ctx.fillStyle = pointpaint.fillStyle
      this._ctx.beginPath();
      this._ctx.arc(coordinate[0], coordinate[1], pointpaint.radius, 0, Math.PI * 2, true);
      this._ctx.fill();
      this._ctx.stroke();
      this._ctx.restore();
    })
  }
  drawLine() {

  }
  drawPolygon() {

  }
}