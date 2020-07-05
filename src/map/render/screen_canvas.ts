import { TilesCache, Tile } from '../tiles/types';
export default class ScreenCanvas {
  private _canvas: HTMLCanvasElement
  private _height: number
  private _width: number
  private _catch_keys: Array<string>
  private _ctx: CanvasRenderingContext2D;
  constructor(width: number, height: number) {
    this._canvas = document.createElement('canvas');
    if (width) {
      this._height = width;
      this._canvas.width = width;
    }
    if (height) {
      this._height = height;
      this._canvas.height = height;
    }
    this._ctx = this._canvas.getContext('2d')
    this._catch_keys = []
  }
  public clear(): void {
    this._ctx.clearRect(0, 0, this._width, this._height);
    this._catch_keys.splice(0)
  }
  public draw(tile: Tile, screenX: number, screenY: number, width: number, height: number): void {
    this._catch_keys.push(tile.key)
    this._ctx.drawImage(tile.image, screenX, screenY, width, height);
  }
  public getImage(): HTMLCanvasElement {
    return this._canvas
  }
  public getContext(): CanvasRenderingContext2D {
    return this._ctx
  }
  public hasTileKey(key: string): boolean {
    return this._catch_keys.includes(key)
  }
}