import { ILayer, LayerOption } from './types'
import { ISource, SourceResult } from '../source/types'
import Utils from '../utils'
import { Transform, Bound } from '../geo/types';
export default class PointLayer implements ILayer {
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
  }
  getImage(): HTMLCanvasElement {
    return this._canvas
  }
  draw(): void {
    this._transform.context.ctx.drawImage(this.getImage(), 0, 0, this._transform.width, this._transform.height)
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
