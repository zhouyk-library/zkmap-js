import { ILayer, LayerOption } from './types'
import { ISource, SourceResult, Tile } from '../source/types'
import Utils from '../utils'
import { Transform, Bound } from '../geo/types';
export default class RasterDebuggerLayer implements ILayer {
  private _enable: boolean = false;
  private _id: string;
  private _transform: Transform;
  private _sourceId: string;
  private _canvas: HTMLCanvasElement;
  private _ctx: CanvasRenderingContext2D
  constructor(option: LayerOption, transform: Transform) {
    this._transform = transform
    this._id = option.id
    this._sourceId = option.source
    const canvas = Utils.Canvas2D.createCanvas(transform.width, transform.height);
    this._canvas = canvas;
    this._ctx = canvas.getContext('2d')
    this._enable = true;
  }
  render(source: ISource): void {
    Utils.Canvas2D.clearRect(this._ctx, 0, 0, this._transform.width, this._transform.height);
    const screenBound: Bound = this._transform.screenBound
    const allCount = Math.pow(2, this._transform.zoomInt)
    const outXEnd = this._transform.width, outXStart = 0, outYEnd = this._transform.height, outYStart = 0
    const inXStart = screenBound.xmin, inYStart = screenBound.ymin, inXEnd = screenBound.xmax, inYEnd = screenBound.ymax
    const countX = inXEnd - inXStart
    const countY = inYEnd - inYStart
    const xstart = Math.floor(allCount / countX * (Math.max(inXStart, outXStart) - inXStart))
    const xend = Math.ceil(allCount / countX * (Math.min(inXEnd, outXEnd) - inXStart))
    const ystart = Math.floor(allCount / countY * (Math.max(inYStart, outYStart) - inYStart))
    const yend = Math.ceil(allCount / countY * (Math.min(inYEnd, outYEnd) - inYStart))

    for (let inexx = xstart; inexx < xend; inexx++) {
      for (let inexy = ystart; inexy < yend; inexy++) {
        const width = 256 * Math.pow(2, this._transform.zoom - this._transform.zoomInt)
        const screenX = inexx * width + inXStart;
        const screenY = inexy * width + inYStart;
        this.drawDebuggerRect(this._transform.zoomInt, inexx, inexy, screenX, screenY, width, this._ctx);
      }
    }
  }
  drawDebuggerRect(z: number, x: number, y: number, screenX: number, screenY: number, width: number, ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.strokeStyle = "#ff9999";
    ctx.fillStyle = "#ff9999";
    ctx.lineWidth = 1;
    ctx.rect(screenX, screenY, width, width);
    ctx.font = '30px Verdana';
    ctx.fillText(`(${z},${x},${y})`, screenX + width / 2 - 100, screenY + width / 2 - 15, 200);
    ctx.closePath();
    ctx.stroke();
  }
  draw(): void {
    this._transform.context.ctx.drawImage(this._canvas, 0, 0, this._transform.width, this._transform.height)
  }
  getSourceId(): string {
    return this._sourceId;
  }
  setSourceId(sourceId: string): void {
    this._sourceId = sourceId
  }
  get id(): string {
    return this._id;
  }
  enable(): void {
    this._enable = true
  }
  disable(): void {
    this._enable = false
  }
  get isEnable(): boolean {
    return this._enable
  }
}
