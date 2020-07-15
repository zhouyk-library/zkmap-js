import { Transform, Projection, Bound, Constant } from '../geo/types';
import { TilesCache, Tile } from '../tiles/types';
import { Map } from '../main/types';
import Utils from '../utils';
export default class Painter {
  private _map: Map;
  private _tilesCache: TilesCache;
  private _transform: Transform;
  private _ctx: CanvasRenderingContext2D;
  private xstart?: number;
  private xend?: number;
  private ystart?: number;
  private yend?: number;
  private viewImages:string[] = new Array();
  constructor(ctx: CanvasRenderingContext2D, map: Map) {
    this._map = map;
    this._transform = this._map.transform
    this._ctx = ctx
    this._tilesCache = new TilesCache(map)
  }
  computed() {
    this.viewImages.splice(0);
    const screenBound: Bound = this._transform.screenBound
    const allCount = Math.pow(2, this._transform.zoomInt)
    const outXEnd = this._transform.width, outXStart = 0, outYEnd = this._transform.height, outYStart = 0
    const inXStart = screenBound.xmin, inYStart = screenBound.ymin, inXEnd = screenBound.xmax, inYEnd = screenBound.ymax

    const countX = inXEnd - inXStart
    const countY = inYEnd - inYStart
    this.xstart = Math.floor(allCount / countX * (Math.max(inXStart, outXStart) - inXStart))
    this.xend = Math.ceil(allCount / countX * (Math.min(inXEnd, outXEnd) - inXStart))
    this.ystart = Math.floor(allCount / countY * (Math.max(inYStart, outYStart) - inYStart))
    this.yend = Math.ceil(allCount / countY * (Math.min(inYEnd, outYEnd) - inYStart))
    for (let inexx = this.xstart; inexx < this.xend; inexx++) {
      for (let inexy = this.ystart; inexy < this.yend; inexy++) {
        this._tilesCache.add(this._transform.zoomInt, inexx, inexy, this._map.getUrl(this._transform.zoomInt, inexx, inexy))
        .then((tile: Tile) => {
          this.renderTile(tile)
        })
      }
    }
    this._tilesCache.clearNoneTiles(this._transform.zoomInt)
  }

  render() {
    const screenBound: Bound = this._transform.screenBound
    const inXStart = screenBound.xmin, inYStart = screenBound.ymin
    this._tilesCache.get(this._transform.zoomInt, this.xstart, this.xend, this.ystart, this.yend).forEach((tile: Tile) => {
      const width =  256 * Math.pow(2, this._transform.zoom - tile.zoom)
      const screenX = tile.x * width + inXStart;
      const screenY = tile.y * width + inYStart;
      console.log('cache:' + tile.key);
      if(this.viewImages.includes(tile.key)) {
        this.drawImage(screenX,screenY,width,width,tile)
      } else {
        this.drawImageOpacity(screenX,screenY,width,width,tile)
        this.viewImages.push(tile.key)
      }
    });
  }
  
  drawImage(screenX:number,screenY:number,height:number,width:number,tile: Tile){
    this._ctx.drawImage(tile.image, screenX, screenY, width, height);
    this.drawDebuggerRect(tile.zoom, tile.x, tile.y, screenX, screenY, width, this._ctx);
  }
  
  drawImageOpacity(screenX:number,screenY:number,height:number,width:number,tile: Tile){
    const opacity = tile.isLoaded ? this.getTileOpacity(tile) : 0
    const alpha = this._ctx.globalAlpha;
    if (opacity < 1) {
      this._ctx.globalAlpha = opacity;
    }
    this.drawImage(screenX, screenY, width, height,tile);
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

  renderTile(tile: Tile) {
    console.log('backf:' + tile.key);
    const screenBound: Bound = this._transform.screenBound;
    const inXStart = screenBound.xmin, inYStart = screenBound.ymin;
    const width = 256 * Math.pow(2, this._transform.zoom - tile.zoom);
    const screenX = tile.x * width + inXStart;
    const screenY = tile.y * width + inYStart;
    this.drawImage(screenX,screenY,width,width,tile);
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
}