import { ILayer, LayerOption } from './types'
import { ISource, SourceResult } from '../source/types'
import Utils from '../utils'
import { Transform, Bound } from '../geo/types';
export default class PolygonLayer implements ILayer {
  private _enable: boolean = false;
  private _id: string;
  private _transform: Transform;
  private _sourceId: string;
  constructor(option: LayerOption, transform: Transform) {
    this._transform = transform
    this._id = option.id
    this._sourceId = option.source
    this._enable = true;
  }
  render(source: ISource): void {
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
