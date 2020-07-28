import {Layer} from './types'
import Utils from '../utils'
export default class RasterLayer implements Layer {
  private _enable: boolean = false;
  private _canvas: HTMLCanvasElement;
  private _ctx:CanvasRenderingContext2D | WebGLRenderingContext
  constructor() {
    const canvas = Utils.Canvas2D.createCanvas(256, 256);
    this._canvas = canvas;
    this._ctx = canvas.getContext('2d')
    this._enable = true;
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
  render(): void{
    // Utils.Canvas2D.image(, this._image, 0, 0, 256, 256);

  }
  getImage(): HTMLCanvasElement{
    return this._canvas
  }
}