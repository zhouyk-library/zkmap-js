import { Transform, Projection, Bound, Constant } from '../geo/types';
import { TilesCache, Tile } from '../tiles/types';
import { Map } from '../main/types';
import Utils from '../utils';
import { ScreenCanvas } from './types';
export default class Painter {
  private _map: Map;
  private _tilesCache: TilesCache;
  private _transform: Transform;
  private _ctx: CanvasRenderingContext2D;
  private _settimeoutindex: any;
  private xstart?: number;
  private xend?: number;
  private ystart?: number;
  private yend?: number;
  private _screen_canvas: ScreenCanvas;
  private _isFinish: boolean = true;
  constructor(ctx: CanvasRenderingContext2D, map: Map) {
    this._map = map;
    this._transform = this._map.transform
    this._ctx = ctx
    this._tilesCache = new TilesCache()
    this._screen_canvas = new ScreenCanvas(this._transform.width, this._transform.height)
  }
  computed() {
    this._isFinish = false
    this._screen_canvas.clear()
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
          // this._tilesCache.add(this._transform.zoomInt,inexx,inexy,`https://tile.openstreetmap.org/${this._transform.zoomInt}/${inexx}/${inexy}.png`)
          // this._tilesCache.add(this._transform.zoomInt,inexx,inexy,`http://192.168.1.149:39999/map/rizhao/osm/${this._transform.zoomInt}/${inexx}/${inexy}.png`)
          // this._tilesCache.add(this._transform.zoomInt, inexx, inexy, `http://webrd01.is.autonavi.com/appmaptile?x=${inexx}&y=${inexy}&z=${this._transform.zoomInt}&lang=zh_cn&size=1&scale=1&style=8`)
          .then((tile: Tile) => {
            this.renderTile(tile)
          })
      }
    }
    this._tilesCache.clearNoneTiles(this._transform.zoomInt)
  }
  render() {
    if (this._settimeoutindex) { window.clearTimeout(this._settimeoutindex) }
    this._ctx.drawImage(this._screen_canvas.getImage(), 0, 0, this._transform.width, this._transform.height);
    this._transform.clearOutTransform()
    this._settimeoutindex = setTimeout(() => {
      const lastFinish = this._isFinish
      this._isFinish = this._tilesCache.isFinishZoom(this._transform.zoomInt, this.xstart, this.xend, this.ystart, this.yend)
      if (!this._isFinish || this._isFinish === !lastFinish) {
        this.render()
        this._settimeoutindex = null
      } else {
        this._isFinish = true
      }
    }, 16.6666)
  }
  renderTile(tile: Tile) {
    const screenBound: Bound = this._transform.screenBound
    const inXStart = screenBound.xmin, inYStart = screenBound.ymin
    const width = 256 * Math.pow(2, this._transform.zoom - tile.zoom)
    const screenX = tile.x * width + inXStart;
    const screenY = tile.y * width + inYStart;
    this._screen_canvas.draw(tile, screenX, screenY, width, width);
    this.drawDebuggerRect(tile.zoom, tile.x, tile.y, screenX, screenY, width, this._screen_canvas.getContext())
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