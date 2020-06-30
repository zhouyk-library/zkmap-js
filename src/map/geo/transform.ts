
import constant from './constant';
import { Projection, WebMercator, LngLat, Bound } from './types'
import { Context } from '../render/types'
import Utils from '../utils'

class Transform {
  tileSize: number;
  private _tileZoom: number;
  maxValidLatitude: number;
  private _scale: number;
  width: number;
  height: number;
  private _zoom: number;
  private _minZoom: number;
  private _maxZoom: number;
  private _type?: string;
  private _center: LngLat;
  private _anchorPoint: number[];
  private _projection: Projection;
  private _bound: Bound;
  private _vbound?: Bound;
  private _screenBound?: Bound;
  private _ctx: CanvasRenderingContext2D;
  private _context: Context;
  private _canvas?: HTMLCanvasElement
  private _matrix: Array<number>
  private _default: Array<number> = new Array()


  constructor(canvas?: HTMLCanvasElement, minZoom?: number, maxZoom?: number, type?: string) {
    this.tileSize = constant.tileSize;
    this.maxValidLatitude = constant.maxValidLatitude;
    this._type = type;
    this._minZoom = minZoom || constant.minZoom;
    this._maxZoom = maxZoom || constant.maxZoom;
    this.width = canvas && canvas.width;
    this.height = canvas && canvas.height;
    this._center = new LngLat(0, 0);
    this._zoom = 0;
    this._projection = new WebMercator();
    this._bound = this._projection.bound;

    if ('2d' === type) {
      this._ctx = canvas.getContext("2d")
      this._context = new Context(this._ctx);
    }
    this._matrix = [256 * Math.pow(2, this._zoom) / (this._bound.xmax - this._bound.xmin) * this._bound.xscale, 0, 0, 256 * Math.pow(2, this._zoom) / (this._bound.ymax - this._bound.ymin) * this._bound.yscale, this.width / 2, this.height / 2]
    Utils.Matrix2D.setFromArray(this._default,this._matrix)

    //设置初始矩阵，由于地图切片是256*256，Math.pow(2, this._zoom)代表在一定缩放级别下x与y轴的切片数量
    this._ctx.setTransform(256 * Math.pow(2, this._zoom) / (this._bound.xmax - this._bound.xmin) * this._bound.xscale, 0, 0, 256 * Math.pow(2, this._zoom) / (this._bound.ymax - this._bound.ymin) * this._bound.yscale, this.width / 2, this.height / 2);

    this.updateVisualBound()
  }
  matrix(option: any): DOMMatrix {
    const ctx = this._ctx
    const matrix: DOMMatrix = ctx.getTransform();
    if (option.scale) {
      /**
       * matrix1 * matrix = matrix2;
       * matrix1当前矩阵,matrix2为变换后的结果矩阵,matrix为变换矩阵
       * 
       * 矩阵变换
       * matrix1 * matrix = matrix2,如下：
       * a1  c1  e1           a   c   e            a2  c2  e2
       * b1  d1  f1     *     b   d   f      =     b2  d2  f2
       * 0   0   1            0   0   1            0   0   1
       * a1*e + c1*f + e1 = e2,且c1 = 0
       * 所以a1 * e + e1 = e2
       * 
       * 1.将原屏幕坐标 x1 转成 初始坐标 x0 = (x1 - e1) / a1  初始矩阵 (1,0,0,1,0,0)
       * 2.初始坐标x0 转成 现屏幕坐标x2  a2 * x0 + e2 = x2    e2 = x2 - a2 * x0  代入1式 e2 = x2 - a2 * (x1 - e1) / a1
       * 3.已知scale = a2 / a1  故 e2 = x2 - scale * (x1 - e1)
       * 4.另矩阵变换 a1 * e + e1 = e2
       * 5.联立3和4  求得 e = (x2 - scale * (x1 - e1) - e1) / a1
       * 
       */
      const _matrix = this.default
      const { scale, x, y } = option.scale
      const a = Math.abs(scale / (matrix.a / _matrix[0])), d = Math.abs(scale / (matrix.d / _matrix[3]))
      const a1 = matrix.a, e1 = matrix.e, x1 = x, x2 = x1;
      matrix.e = (x2 - a * (x1 - e1) - e1) / a1;
      const d1 = matrix.d, f1 = matrix.f, y1 = y, y2 = y1;
      matrix.f = (y2 - d * (y1 - f1) - f1) / d1;
      matrix.a = a
      matrix.d = d
      this._ctx.transform(matrix.a, 0, 0, matrix.d, matrix.e, matrix.f);
    }
    if (option.mov) {
      const { dx, dy } = option.mov
      matrix.e = dx / matrix.a
      matrix.f = dy / matrix.d
      this._ctx.translate(matrix.e, matrix.f);
      console.log(Utils.Matrix2D.matrixToArray(ctx.getTransform()))
    }
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.restore()
    this.updateVisualBound()
    return matrix;
  }
  get context(): Context {
    return this._context
  }

  get bound(): Bound {
    return this._bound
  }
  get screenBound(): Bound {
    return this._screenBound
  }
  get VBound(): Bound {
    return this._vbound
  }
  get minZoom(): number { return this._minZoom; }
  set minZoom(zoom: number) {
    if (this._minZoom === zoom) return;
    this._minZoom = zoom;
    this.zoom = Math.max(this.zoom, zoom);
  }

  get maxZoom(): number { return this._maxZoom; }
  set maxZoom(zoom: number) {
    if (this._maxZoom === zoom) return;
    this._maxZoom = zoom;
    this.zoom = Math.min(this.zoom, zoom);
  }

  get zoom(): number { return this._zoom; }
  get zoomInt(): number { return Math.floor(this._zoom); }
  set zoom(zoom: number) {
    const z = Math.min(Math.max(zoom, this.minZoom), this.maxZoom);
    if (this._zoom === z) return;
    this._zoom = z;
  }

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  get center(): LngLat { return this._center; }
  set center(center: LngLat) {
    this._anchorPoint = null
    if (center.lat === this._center.lat && center.lng === this._center.lng) return;
    this._center = center;
  }
  set mzoom(zoom: number) {
    const z = Math.min(Math.max(zoom, this.minZoom), this.maxZoom);
    this._scale = this.zoomScale(z);
    this._tileZoom = Math.floor(z);
    this.updateZoomMatrix()
  }
  updateZoomMatrix(){
    const matrix:Array<number> = this.default
    const x = this._anchorPoint[0], y = this._anchorPoint[1]
    const a = Math.abs(this._scale / (this._matrix[0] / matrix[0])), d = Math.abs(this._scale / (this._matrix[3] / matrix[3]))
    const e1 = this._matrix[4], x1 = x, x2 = x1;
    const e = (x2 - a * (x1 - e1) - e1) / this._matrix[0];
    const f1 = this._matrix[5], y1 = y, y2 = y1;
    const f = (y2 - d * (y1 - f1) - f1) / this._matrix[3];
    Utils.Matrix2D.multiply(this._matrix,Array.from([a, 0, 0, d, e, f]))
  }
  moveCenter([dx, dy]: number[]){
    const dxe = dx / this._matrix[0]
    const dyf = dy / this._matrix[3]
    Utils.Matrix2D.translate(this._matrix,dxe,dyf)
    console.log(this._matrix)
  }
  set anchorPoint(pixel: number[]){
    this._anchorPoint = pixel
  }
  lngLat2Project(lngLat: number[]): number[]{
    return this._projection.project(lngLat)
  }
  project2LngLat(coordinate: number[]): number[]{
    return this._projection.unproject(coordinate)
  }
  project2screen(coordinate: number[]): number[]{
    return Utils.Matrix2D.transform(this._matrix,coordinate)
  }
  screen2project(pixel: number[]): number[]{
    return Utils.Matrix2D.invertTransform(this._matrix,pixel)
  }
  lngLat2screen(lngLat: number[]): number[]{
    return this.project2screen(this.lngLat2Project(lngLat))
  }
  screen2lngLat(pixel: number[]): number[]{
    return this.project2LngLat(this.screen2project(pixel))
  }
  get default():Array<number> { return Utils.Matrix2D.setFromArray(new Array(),this._default) }
  get tileZoom(): number{return this._tileZoom}
  get scale(): number{return this._scale}
  get projection(): Projection { return this._projection; }
  set projection(projection: Projection) { this._projection = projection; }
  zoomScale(zoom: number) { return Math.pow(2, zoom); }
  scaleZoom(scale: number) { return Math.log(scale) / Math.LN2; }
  updateVisualBound(): void {
    const matrix = this._ctx.getTransform();
    const x1 = (0 - matrix.e) / matrix.a, y1 = (0 - matrix.f) / matrix.d, x2 = (this.width - matrix.e) / matrix.a, y2 = (this.height - matrix.f) / matrix.d;
    this._vbound = new Bound(Math.min(x1, x2), Math.min(y1, y2), Math.max(x1, x2), Math.max(y1, y2));
    this._screenBound = new Bound((matrix.a * this._bound.xmin * this._bound.xscale + matrix.e),
      (matrix.d * this._bound.ymin * this._bound.yscale + matrix.f),
      (matrix.a * this._bound.xmax * this._bound.xscale + matrix.e),
      (matrix.d * this._bound.ymax * this._bound.yscale + matrix.f));
  }
}

export default Transform;
