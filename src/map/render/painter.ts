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
    this._tilesCache = new TilesCache()
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
        // this._tilesCache.add(this._transform.zoomInt,inexx,inexy,`http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${this._transform.zoomInt}/${inexy}/${inexx}`)
        // this._tilesCache.add(this._transform.zoomInt,inexx,inexy,`http://localhost:39999/map/rizhao/google/${this._transform.zoomInt}/${inexx}/${inexy}.jpeg`)
        this._tilesCache.add(this._transform.zoomInt, inexx, inexy, `http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x=${inexx}&y=${inexy}&z=${this._transform.zoomInt}`)
        // this._tilesCache.add(this._transform.zoomInt, inexx, inexy, `http://rt1.map.gtimg.com/realtimerender?z=${this._transform.zoomInt}&x=${inexx}&y=${Math.pow(2, this._transform.zoomInt) - 1 - inexy}&type=vector&style=0&tms=true`)
          // this._tilesCache.add(this._transform.zoomInt,inexx,inexy,`https://tile.openstreetmap.org/${this._transform.zoomInt}/${inexx}/${inexy}.png`)
          // this._tilesCache.add(this._transform.zoomInt,inexx,inexy,`http://192.168.1.149:39999/map/rizhao/osm/${this._transform.zoomInt}/${inexx}/${inexy}.png`)
          // this._tilesCache.add(this._transform.zoomInt, inexx, inexy, `http://webrd01.is.autonavi.com/appmaptile?x=${inexx}&y=${inexy}&z=${this._transform.zoomInt}&lang=zh_cn&size=1&scale=1&style=8`)
          .then((tile: Tile) => {
            this.render()
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
      if(this.viewImages.includes(tile.key)){
        this.drawImage(screenX,screenY,width,width,tile)
      }else{
        this.drawImageOpacity(screenX,screenY,width,width,tile)
        tile.isLoaded && this.viewImages.push(tile.key)
      }
      this.drawDebuggerRect(tile.zoom, tile.x, tile.y, screenX, screenY, width, this._ctx);
    });
  }
  
  drawImage(screenX:number,screenY:number,height:number,width:number,tile: Tile){
    this._ctx.drawImage(tile.image, screenX, screenY, width, height);
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

  getTileOpacity(tile:Tile) {
    if (!tile.time) {
        return 1;
    }
    return Math.min(1, (Utils.Browser.now() - tile.time) / (1000 / 60 * 10));
  }
  renderTile(tile: Tile) {
    const screenBound: Bound = this._transform.screenBound
    const inXStart = screenBound.xmin, inYStart = screenBound.ymin
    const width = 256 * Math.pow(2, this._transform.zoom - tile.zoom)
    const screenX = tile.x * width + inXStart;
    const screenY = tile.y * width + inYStart;
    this.drawImageOpacity(screenX,screenY,width,width,tile)
  }
  drawDebuggerRect(z: number, x: number, y: number, screenX: number, screenY: number, width: number, ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.strokeStyle = "#ff9999";
    ctx.fillStyle = "#ff9999";
    ctx.lineWidth = 1
    ctx.rect(screenX, screenY, width, width);
    ctx.font = `${30}px Verdana`;
    ctx.fillText(`(${z},${x},${y})`, screenX + width / 2 - 100, screenY + width / 2 - 15, 200);
    ctx.closePath()
    ctx.stroke();
  }
}