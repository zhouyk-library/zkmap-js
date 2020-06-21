
import constant from './constant';
import {Projection,WebMercator,LngLat,Bound} from './types'
import {Context} from '../render/types'

class Transform {
  tileSize: number;
  tileZoom: number;
  maxValidLatitude: number;
  scale: number;
  width: number;
  height: number;
  private _zoom: number;
  private _minZoom: number;
  private _maxZoom: number;
  private _type?: string;
  private _center: LngLat;
  private _projection: Projection;
  private _bound:Bound;
  private _vbound?: Bound;
  private _screenBound?: Bound;
  private _ctx: CanvasRenderingContext2D;
  private _context: Context;
  private _canvas?: HTMLCanvasElement
  

  constructor(canvas?: HTMLCanvasElement,minZoom?: number, maxZoom?: number, type?: string) {
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
    
    if('2d' === type){
      this._ctx = canvas.getContext("2d")
      this._context = new Context(this._ctx);
    }
      
    //设置初始矩阵，由于地图切片是256*256，Math.pow(2, this._zoom)代表在一定缩放级别下x与y轴的切片数量
    this._ctx.setTransform(256 * Math.pow(2, this._zoom) / (this._bound.xmax - this._bound.xmin) * this._bound.xscale ,0, 0, 256 * Math.pow(2, this._zoom) / (this._bound.ymax - this._bound.ymin) * this._bound.yscale, this.width / 2, this.height / 2);
    
    this.updateVisualBound()
  }

  clone(): Transform {
    const clone = new Transform(null,this._minZoom, this._maxZoom,this._type);
    clone.width = this.width;
    clone.height = this.height;
    clone._center = this._center;
    clone.zoom = this.zoom;
    clone._context = this._context;
    return clone;
  }
  
  matrix(option: any):DOMMatrix {
    const ctx = this._ctx
    const matrix:DOMMatrix = ctx.getTransform();
    if(option.scale){
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
      const {scale,x,y} = option.scale
      const a1 = matrix.a, e1 = matrix.e, x1 = x, x2 = x1;
      matrix.e = (x2 - scale * (x1 - e1) - e1) / a1;
      const d1 = matrix.d, f1 = matrix.f, y1 = y, y2 = y1;
      matrix.f = (y2 - scale * (y1 - f1) - f1) / d1;
      matrix.a = scale
      matrix.d = scale
      this._ctx.transform( matrix.a, 0, 0, matrix.d, matrix.e, matrix.f );
    }
    if(option.mov){
      const {dx,dy} = option.mov
      matrix.e = dx / matrix.a
      matrix.f = dy / matrix.d
      this._ctx.translate( matrix.e, matrix.f);
    }
    ctx.save();
    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.restore()
    this.updateVisualBound()
    return matrix;
  }
  get context():Context {
    return this._context
  }

  get bound():Bound {
    return this._bound
  }
  get screenBound():Bound {
    return this._screenBound
  }
  get VBound():Bound {
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
  set zoom(zoom: number) {
      const z = Math.min(Math.max(zoom, this.minZoom), this.maxZoom);
      if (this._zoom === z) return;
      this._zoom = z;
      this.scale = this.zoomScale(z);
      this.tileZoom = Math.floor(z);
  }

  get center(): LngLat { return this._center; }
  set center(center: LngLat) {
      if (center.lat === this._center.lat && center.lng === this._center.lng) return;
      this._center = center;
  }

  resize(width: number, height: number) {
      this.width = width;
      this.height = height;
  }
  get projection():Projection {return this._projection;}
  set projection(projection:Projection){this._projection = projection;}
  zoomScale(zoom: number) { return Math.pow(2, zoom); }
  scaleZoom(scale: number) { return Math.log(scale) / Math.LN2; }
  updateVisualBound():void {
    const matrix = this._ctx.getTransform();
    const x1 = (0 - matrix.e)/matrix.a, y1 = (0-matrix.f)/matrix.d, x2 = (this.width - matrix.e)/matrix.a, y2 = (this.height-matrix.f)/matrix.d;
    this._vbound = new Bound(Math.min(x1,x2), Math.min(y1,y2), Math.max(x1,x2), Math.max(y1,y2));
    this._screenBound = new Bound((matrix.a * this._bound.xmin*this._bound.xscale + matrix.e),
    (matrix.d * this._bound.ymin*this._bound.yscale + matrix.f),
    (matrix.a * this._bound.xmax*this._bound.xscale + matrix.e),
    (matrix.d * this._bound.ymax*this._bound.yscale + matrix.f));
  }
}

export default Transform;
