export default class Raster {
  static draw(_ctx: CanvasRenderingContext2D, imageSource: Array<any>): void {
    _ctx.save();
    _ctx.setTransform(1, 0, 0, 1, 0, 0);
    imageSource.forEach(data => {
      _ctx.drawImage(data.img, data.offsetX, data.offsetY, 256, 256);
    })
    _ctx.restore();
  }
}