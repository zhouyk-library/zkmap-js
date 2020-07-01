import { Transform, Projection, Bound, Constant } from '../geo/types';
import { TilesCache, Tile } from '../tiles/types';
export default class Painter {
  private _tilesCache: TilesCache;
  private _transform: Transform;
  private _ctx: CanvasRenderingContext2D;
  constructor(ctx: CanvasRenderingContext2D, transform: Transform) {
    this._transform = transform
    this._ctx = ctx
    this._tilesCache = new TilesCache()
  }
  computed() {
    const screenBound: Bound = this._transform.screenBound
    const allCount = Math.pow(2, this._transform.zoomInt)
    const outXEnd = this._transform.width, outXStart = 0, outYEnd = this._transform.height, outYStart = 0
    const inXStart = screenBound.xmin, inYStart = screenBound.ymin, inXEnd = screenBound.xmax, inYEnd = screenBound.ymax

    const countX = inXEnd - inXStart
    const countY = inYEnd - inYStart
    var xstart = Math.floor(allCount / countX * (Math.max(inXStart, outXStart) - inXStart))
    var xend = Math.ceil(allCount / countX * (Math.min(inXEnd, outXEnd) - inXStart))
    var ystart = Math.floor(allCount / countY * (Math.max(inYStart, outYStart) - inYStart))
    var yend = Math.ceil(allCount / countY * (Math.min(inYEnd, outYEnd) - inYStart))
    for (let inexx = xstart; inexx < xend; inexx++) {
      for (let inexy = ystart; inexy < yend; inexy++) {
        // this._tilesCache.add(this._transform.zoomInt,inexx,inexy,`http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${this._transform.zoomInt}/${inexy}/${inexx}`)
        // this._tilesCache.add(this._transform.zoomInt,inexx,inexy,`http://localhost:39999/map/rizhao/google/${this._transform.zoomInt}/${inexx}/${inexy}.jpeg`)
        this._tilesCache.add(this._transform.zoomInt, inexx, inexy, `http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x=${inexx}&y=${inexy}&z=${this._transform.zoomInt}`)
        // this._tilesCache.add(this._transform.zoomInt,inexx,inexy,`https://tile.openstreetmap.org/${this._transform.zoomInt}/${inexx}/${inexy}.png`)
        // this._tilesCache.add(this._transform.zoomInt,inexx,inexy,`http://192.168.1.149:39999/map/rizhao/osm/${this._transform.zoomInt}/${inexx}/${inexy}.png`)
        // this._tilesCache.add(this._transform.zoomInt, inexx, inexy, `http://webrd01.is.autonavi.com/appmaptile?x=${inexx}&y=${inexy}&z=${this._transform.zoomInt}&lang=zh_cn&size=1&scale=1&style=8`)
      }
    }
    this._tilesCache.clearNoneTiles(this._transform.zoomInt)
  }
  render() {
    const screenBound: Bound = this._transform.screenBound
    const allCount = Math.pow(2, this._transform.zoomInt)
    const outXEnd = this._transform.width, outXStart = 0, outYEnd = this._transform.height, outYStart = 0
    const inXStart = screenBound.xmin, inYStart = screenBound.ymin, inXEnd = screenBound.xmax, inYEnd = screenBound.ymax

    const countX = inXEnd - inXStart
    const countY = inYEnd - inYStart
    var xstart = Math.floor(allCount / countX * (Math.max(inXStart, outXStart) - inXStart))
    var xend = Math.ceil(allCount / countX * (Math.min(inXEnd, outXEnd) - inXStart))
    var ystart = Math.floor(allCount / countY * (Math.max(inYStart, outYStart) - inYStart))
    var yend = Math.ceil(allCount / countY * (Math.min(inYEnd, outYEnd) - inYStart))
    this._tilesCache.get(this._transform.zoomInt, xstart, xend, ystart, yend).forEach((item: Tile) => {
      const width = 256 * Math.pow(2, this._transform.zoom - item.zoom)
      const screenX = item.x * width + inXStart;
      const screenY = item.y * width + inYStart;
      this._ctx.drawImage(item.image, screenX, screenY, width, width);
      this.drawDebuggerRect(item.zoom, item.x, item.y, screenX, screenY, width, this._ctx)
    })
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