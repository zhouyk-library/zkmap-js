import { ILayer, LayerOption } from './types'
import { ISource, SourceResult, Tile } from '../source/types'
import Utils from '../utils'
import { Transform, Bound } from '../geo/types';
export default class RasterLayer implements ILayer {
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
    const sourceResult: SourceResult = source.getData(this._transform, screenBound)
    console.log(sourceResult.tile_child);
    this.drawImages(sourceResult.tile_parent)
      .drawImages(sourceResult.tile_child)
      .drawImages(sourceResult.tile_cur)
  }
  drawImages(tiles: Tile[] = []) {
    tiles.forEach((tile: Tile) => {
      this.drawImageOpacity(tile)
    });
    return this
  }
  drawImageOpacity(tile: Tile) {
    const opacity = tile.isLoaded ? this.getTileOpacity(tile) : 0
    const alpha = this._ctx.globalAlpha;
    if (opacity < 1) {
      this._ctx.globalAlpha = opacity;
    }
    this._ctx.drawImage(tile.image, tile.dx, tile.dy, tile.dw, tile.dh);
    if (this._ctx.globalAlpha !== alpha) {
      this._ctx.globalAlpha = alpha;
    }
  }
  getTileOpacity(tile: Tile) {
    if (!tile.time) {
      return 1;
    }
    return Math.min(1, (Utils.Browser.now() - tile.time) / (1000 / 60 * 10));
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
