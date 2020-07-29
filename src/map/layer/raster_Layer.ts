import {ILayer} from './types'
import Utils from '../utils'
export default class RasterLayer implements ILayer {
  private _enable: boolean = false;
  private _id: String;
  private _sourceId: String;
  private _canvas: HTMLCanvasElement;
  private _ctx:CanvasRenderingContext2D | WebGLRenderingContext
  constructor(id:String) {
    this._id = id
    const canvas = Utils.Canvas2D.createCanvas(256, 256);
    this._canvas = canvas;
    this._ctx = canvas.getContext('2d')
    this._enable = true;
  }
  render(): void{
    // Utils.Canvas2D.image(, this._image, 0, 0, 256, 256);

  }
  getImage(): HTMLCanvasElement{
    return this._canvas
  }
  getSourceId():String {
    return this._sourceId;
  }
  setSourceId(sourceId :String): void {
    this._sourceId = sourceId
  }
  get id():String {
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