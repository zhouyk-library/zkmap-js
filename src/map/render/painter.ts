import { Transform, Projection, Bound, Constant } from '../geo/types';
import { TilesCache,Tile } from '../tiles/types';
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
    const ctx = this._ctx
    const screenBound: Bound = this._transform.screenBound
    const allCount = Math.pow(2, this._transform.zoom)
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
        // this._tilesCache.add(this._transform.zoom,inexx,inexy,`http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${this._transform.zoom}/${inexy}/${inexx}`)
        // this._tilesCache.add(this._transform.zoom,inexx,inexy,`http://localhost:39999/map/rizhao/google/${this._transform.zoom}/${inexx}/${inexy}.jpeg`)
        this._tilesCache.add(this._transform.zoom,inexx,inexy,`http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x=${inexx}&y=${inexy}&z=${this._transform.zoom}`)
        // this._tilesCache.add(this._transform.zoom,inexx,inexy,`https://tile.openstreetmap.org/${this._transform.zoom}/${inexx}/${inexy}.png`)
        // this._tilesCache.add(this._transform.zoom,inexx,inexy,`http://webrd01.is.autonavi.com/appmaptile?x=${inexx}&y=${inexy}&z=${this._transform.zoom}&lang=zh_cn&size=1&scale=1&style=8`)
      }
    }
    this._tilesCache.clearNoneTiles(this._transform.zoom)
  }
  render() {
    const ctx = this._ctx
    const screenBound: Bound = this._transform.screenBound
    const allCount = Math.pow(2, this._transform.zoom)
    const outXEnd = this._transform.width, outXStart = 0, outYEnd = this._transform.height, outYStart = 0
    const inXStart = screenBound.xmin, inYStart = screenBound.ymin, inXEnd = screenBound.xmax, inYEnd = screenBound.ymax

    const countX = inXEnd - inXStart
    const countY = inYEnd - inYStart
    var xstart = Math.floor(allCount / countX * (Math.max(inXStart, outXStart) - inXStart))
    var xend = Math.ceil(allCount / countX * (Math.min(inXEnd, outXEnd) - inXStart))
    var ystart = Math.floor(allCount / countY * (Math.max(inYStart, outYStart) - inYStart))
    var yend = Math.ceil(allCount / countY * (Math.min(inYEnd, outYEnd) - inYStart))
    this._ctx.save();
    this._ctx.setTransform(1, 0, 0, 1, 0, 0);
    this._tilesCache.get(this._transform.zoom,xstart,xend,ystart,yend).forEach((item:Tile)=>{
      const width = 256 * Math.pow(2, this._transform.zoom - item.zoom)
      const screenX = item.x * width + inXStart;
      const screenY = item.y * width + inYStart;
      this._ctx.drawImage(item.image, screenX, screenY, width, width);
      ctx.beginPath();
      ctx.strokeStyle = "#ff9999";
      ctx.fillStyle = "#ff9999";
      ctx.lineWidth = 1
      ctx.rect(screenX, screenY, width, width);
      ctx.font = `${30}px Verdana`;
      ctx.fillText(`(${item.zoom},${item.x},${item.y})`, screenX + width/2 - 100, screenY + width/2 - 15, 200);
      ctx.closePath()
      ctx.stroke();
    })
    this._ctx.restore();
  }
}