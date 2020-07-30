import {ILayer,LayerOption} from './types'
import {ISource,SourceResult,Tile} from '../source/types'
import Utils from '../utils'
import { Transform, Bound } from '../geo/types';
export default class RasterLayer implements ILayer {
  private _enable: boolean = false;
  private _id: string;
  private _transform: Transform;
  private _sourceId: string;
  private _canvas: HTMLCanvasElement;
  private _ctx:CanvasRenderingContext2D
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
    const sourceResult:SourceResult = source.getData(this._transform.zoomInt,xstart, xend, ystart, yend)
    this.drawImages(sourceResult.tile_parent).drawImages(sourceResult.tile_child).drawImages(sourceResult.tile_cur)
  }
  drawImages(tiles: Tile[] = []){
    const screenBound: Bound = this._transform.screenBound
    const inXStart = screenBound.xmin, inYStart = screenBound.ymin
    tiles.forEach((tile: Tile) => {
      const width =  256 * Math.pow(2, this._transform.zoom - tile.z)
      const screenX = tile.x * width + inXStart;
      const screenY = tile.y * width + inYStart;
      this.drawImageOpacity(screenX,screenY,width,width,tile)
    });
    return this
  }
  drawImageOpacity(screenX:number,screenY:number,height:number,width:number,tile: Tile) {
    const opacity = tile.isLoaded ? this.getTileOpacity(tile) : 0
    const alpha = this._ctx.globalAlpha;
    if (opacity < 1) {
      this._ctx.globalAlpha = opacity;
    }
    this._ctx.drawImage(tile.image, screenX, screenY, width, height);
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

  getImage(): HTMLCanvasElement{
    return this._canvas
  }
  draw():void{
    this._transform.context.ctx.drawImage(this.getImage(),0,0,this._transform.height, this._transform.width)
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