import { ILayer, LayerOption } from './types'
import { ISource, SourceResult } from '../source/types'
import Utils from '../utils'
import { Transform, Bound } from '../geo/types';
import { Paint, Painter } from '../render/types';
export default class PointLayer implements ILayer {
  private _enable: boolean = false;
  private _id: string;
  private _transform: Transform;
  private _sourceId: string;
  private _paint: Paint;
  private _painter: Painter;
  constructor(option: LayerOption, transform: Transform, painter: Painter) {
    this._transform = transform
    this._id = option.id
    this._paint = option.paint
    this._sourceId = option.source
    this._enable = true;
    this._painter = painter;
  }
  render(source: ISource): void {
    const { coordinates } = source.getData(this._transform, this._transform.screenBound)
    this._painter.draw(this._paint, coordinates)
  }
  draw(): void {
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
