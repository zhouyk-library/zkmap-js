import { Transform, Projection, Bound, Constant } from '../geo/types';
import { TitleSource } from './types';
import { TilesCache,Tile } from '../tiles/types';
export default class Painter {
  private _titleSource: TitleSource;
  private _tilesCache: TilesCache;
  private _transform: Transform;
  private _ctx: CanvasRenderingContext2D;
  constructor(ctx: CanvasRenderingContext2D, transform: Transform) {
    this._transform = transform
    this._ctx = ctx
    this._titleSource = new TitleSource()
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
  // render() {
  //   const ctx = this._ctx
  //   const screenBound: Bound = this._transform.screenBound
  //   const allCount = Math.pow(2, this._transform.zoom)
  //   const outXEnd = this._transform.width, outXStart = 0, outYEnd = this._transform.height, outYStart = 0
  //   const inXStart = screenBound.xmin, inYStart = screenBound.ymin, inXEnd = screenBound.xmax, inYEnd = screenBound.ymax

  //   const countX = inXEnd - inXStart
  //   const countY = inYEnd - inYStart
  //   var xstart = Math.floor(allCount / countX * (Math.max(inXStart, outXStart) - inXStart))
  //   var xend = Math.ceil(allCount / countX * (Math.min(inXEnd, outXEnd) - inXStart))
  //   var ystart = Math.floor(allCount / countY * (Math.max(inYStart, outYStart) - inYStart))
  //   var yend = Math.ceil(allCount / countY * (Math.min(inYEnd, outYEnd) - inYStart))
  //   for (let inexx = xstart; inexx < xend; inexx++) {
  //     for (let inexy = ystart; inexy < yend; inexy++) {
  //       const screenX = inexx * 256 + inXStart;
  //       const screenY = inexy * 256 + inYStart;
  //       this.loadImage(this._transform.zoom, inexx, inexy, screenX, screenY).then(res => {
  //         ctx.save();
  //         ctx.setTransform(1, 0, 0, 1, 0, 0);
  //         ctx.beginPath();
  //         ctx.strokeStyle = "#ff9999";
  //         ctx.fillStyle = "#ff9999";
  //         ctx.lineWidth = 1
  //         ctx.rect(screenX, screenY, 256, 256);
  //         ctx.font = `${30}px Verdana`;
  //         ctx.fillText(`(${this._transform.zoom},${inexx},${inexy})`, screenX + 20, screenY + 130, 200);
  //         ctx.closePath()
  //         ctx.stroke();
  //         ctx.restore();
  //       })
  //     }
  //   }
  // }
  loadImage(z, x, y, offsetX, offsetY) {
    return new Promise((resolve, reject) => {
      this._titleSource.getTitle(z, x, y, (err, img) => {
        if (err) {
          console.error(err)
          return;
        }
        this._ctx.save();
        this._ctx.setTransform(1, 0, 0, 1, 0, 0);
        // this._ctx.clearRect(offsetX, offsetY, 256, 256);
        this._ctx.drawImage(img, offsetX, offsetY, 256, 256);
        this._ctx.restore();
        resolve()
      })
    })
  }
  static draw(_ctx: CanvasRenderingContext2D, imageSource: Array<any>): void {
    _ctx.save();
    _ctx.setTransform(1, 0, 0, 1, 0, 0);
    imageSource.forEach(data => {
      _ctx.drawImage(data.img, data.offsetX, data.offsetY, 256, 256);
    })
    _ctx.restore();
  }
}