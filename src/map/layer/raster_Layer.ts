import {ILayer,LayerOption} from './types'
import {ISource} from '../source/types'
import Utils from '../utils'
import {Transform} from '../geo/types';
export default class RasterLayer implements ILayer {
  private _enable: boolean = false;
  private _id: string;
  private _transform: Transform;
  private _sourceId: string;
  private _canvas: HTMLCanvasElement;
  private _ctx:CanvasRenderingContext2D | WebGLRenderingContext
  constructor(option:LayerOption,transform: Transform) {
    this._transform = transform
    this._id = option.id
    this._sourceId = option.source
    const canvas = Utils.Canvas2D.createCanvas(transform.height, transform.width);
    this._canvas = canvas;
    this._ctx = canvas.getContext('2d')
    this._enable = true;
  }
  render(source:ISource): void{
    // Utils.Canvas2D.image(, this._image, 0, 0, 256, 256);

  }
  getImage(): HTMLCanvasElement{
    return this._canvas
  }
  getSourceId():string {
    return this._sourceId;
  }
  setSourceId(sourceId :string): void {
    this._sourceId = sourceId
  }
  get id():string {
    return this._id;
  }
  enable(): void{
    this._enable = true
  }
  disable(): void{
    this._enable = false
  }
  get isEnable(): boolean{
    return this._enable
  }
}