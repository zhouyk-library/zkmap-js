
export default class Point {
  private _x:number;
  private _y:number;
  constructor(x:number, y:number) {
    this._x = x;
    this._y = y;
  }
  get x():number{return this._x}
  get y():number{return this._y}
  public toArray():number[]{
    return [this._x,this._y]
  }
  /**
   * 克隆一个新的点
   */
  public clone():Point { return new Point(this._x, this._y); }
  /**
   * 两点相加
   * @param p 
   */
  public add(p:Point):Point { return this.clone()._add(p); }
  /**
   * 两点相减
   * @param p 
   */
  public sub(p:Point):Point { return this.clone()._sub(p); }
  /**
   * 两点相乘
   * @param p 
   */
  public multByPoint(p:Point):Point { return this.clone()._multByPoint(p); }
  /**
   * 点坐标乘以一个数字
   * @param k 
   */
  public mult(k:number):Point { return this.clone()._mult(k); }
  /**
   * 两点相除
   * @param p 
   */
  public divByPoint(p:Point):Point { return this.clone()._divByPoint(p); }
  /**
   * 点坐标除以一个数字
   * @param k 
   */
  public div(k:number):Point { return this.clone()._div(k); }
  /**
   * 旋转一个弧度
   * @param a 
   */
  public rotate(a:number):Point { return this.clone()._rotate(a); }
  /**
   * 围绕一点旋转一个弧度
   * @param a 
   * @param p 
   */
  public rotateAround(a:number,p:Point):Point { return this.clone()._rotateAround(a,p); }
  /**
   * 点是否在范围内
   * @param m 
   */
  public matMult(m:number[]):Point { return this.clone()._matMult(m); }
  /**
   * 单位向量点，求向量((0,0) , Point)上的的单位向量的点
   */
  public unit():Point { return this.clone()._unit(); }
  /**
   * 垂直点，与(0,0)点的连线构成直角
   */
  public perp():Point { return this.clone()._perp(); }
  /**
   * 去坐标小数点
   */
  public round():Point { return this.clone()._round(); }
  /**
   * 和(0,0)坐标的距离
   */
  public mag():number{ return this._x * this._x + this._y * this._y }
  /**
   * 判断两点坐标是否相等
   * @param other 
   */
  public equals(other:Point):boolean{ return this.x === other.x && this.y === other.y; }
  /**
   * 计算距离
   * @param p 
   */
  public dist(p:Point):number{ return Math.sqrt(this.distSqr(p)); }
  /**
   * 计算距离的平方
   * @param p 
   */
  public distSqr(p:Point):number{ return Math.pow(p.x - this.x,2) * Math.pow(p.y - this.y,2) }
  /**
   * 与(0,0)的弧度
   */
  public angle():number{ return Math.atan2(this.y, this.x); }
  /**
   * 与点b的弧度
   * @param b 
   */
  public angleTo(b:Point):number{ return Math.atan2(this.y - b.y, this.x - b.x); }
  /**
   * 与点b的夹角弧度
   * @param b 
   */
  public angleWith(b:Point):number{ return this.angleWithSep(b.x, b.y); }
  /**
   * 和(x,y)的夹角弧度，a x b = |a||b|sin(θ)
   * @param x 
   * @param y 
   */
  public angleWithSep(x:number, y:number):number{ return Math.atan2(this.x * y - this.y * x,this.x * x + this.y * y); }
  
  private _matMult(m:Array<number>):Point{
    const x:number = m[0] * this.x + m[1] * this.y,
        y:number = m[2] * this.x + m[3] * this.y;
    this._x = x;
    this._y = y;
    return this;
  }
  private _add(p:Point):Point{
    this._x += p.x;
    this._y += p.y;
    return this;
  }
  private _sub(p:Point):Point{
    this._x -= p.x;
    this._y -= p.y;
    return this;
  }
  private _mult(k:number):Point{
    this._x *= k;
    this._y *= k;
    return this;
  }
  private _div(k:number):Point{
    this._x /= k;
    this._y /= k;
    return this;
  }
  private _multByPoint(p:Point):Point {
    this._x *= p.x;
    this._y *= p.y;
    return this;
  }
  private _divByPoint(p:Point):Point {
    this._x /= p.x;
    this._y /= p.y;
    return this;
  }

  private _unit() {
    this._div(this.mag());
    return this;
  }

  private _perp():Point {
    const y:number = this.y;
    this._y = this._x;
    this._x = -y;
    return this;
  }

  private _rotate(angle:number):Point {
    const cos:number = Math.cos(angle),
        sin:number = Math.sin(angle),
        x:number = cos * this._x - sin * this._y,
        y:number = sin * this._x + cos * this._y;
    this._x = x;
    this._y = y;
    return this;
  }

  private _rotateAround(angle:number, p:Point):Point {
    const cos:number = Math.cos(angle),
        sin:number = Math.sin(angle),
        x:number = p.x + cos * (this._x - p.x) - sin * (this._y - p.y),
        y:number = p.y + sin * (this._x - p.x) + cos * (this._y - p.y);
    this._x = x;
    this._y = y;
    return this;
  }

  private _round() {
    this._x = Math.round(this._x);
    this._y = Math.round(this._y);
    return this;
  }
  static convert(a?:Point):Point{
    if (a instanceof Point) {
      return a;
    }
    if (Array.isArray(a)) {
        return new Point(a[0], a[1]);
    }
    return a;
  }
}