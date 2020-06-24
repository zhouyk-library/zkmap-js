const tmp_:Array<number> = new Array(6);

/**
 * 创建一个二维矩阵
 */
export function create():Array<number> {
  return Array.from([1, 0, 0, 1, 0, 0])
}

/**
 * 将矩阵转换为CSS的transform变量
 * @param mat 
 */
export function toCssString(mat:Array<number>) {
  return 'matrix(' + mat.join(', ') + ')';
}

/**
 * 设置transform矩阵对应的数据
 * @param transform [a,b,c,d,e,f]
 * @param a 
 * @param b 
 * @param c 
 * @param d 
 * @param e 
 * @param f 
 */
export function set(transform:Array<number>, a:number, b:number, c:number, d:number, e:number, f:number):Array<number> {
  transform[0] = a;
  transform[1] = b;
  transform[2] = c;
  transform[3] = d;
  transform[4] = e;
  transform[5] = f;
  return transform;
}

/**
 * 创造一个缩放矩阵
 * @param target 
 * @param x 
 * @param y 
 */
export function makeScale(target:Array<number>, x:number, y:number):Array<number> {
  return set(target, x, 0, 0, y, 0, 0);
}

/**
 * 初始化transform矩阵的数据
 * @param transform [a,b,c,d,e,f]
 */
export function reset(transform:Array<number>):Array<number> {
  return set(transform, 1, 0, 0, 1, 0, 0);
}

/**
 * 矩阵相乘
 * 矩阵transform1  * 矩阵transform2 => 矩阵transform1
 * @param transform1 被乘数
 * @param transform2 乘数
 */
export function multiply(transform1:Array<number>, transform2:Array<number>):Array<number> {
  const a1:number = transform1[0];
  const b1:number = transform1[1];
  const c1:number = transform1[2];
  const d1:number = transform1[3];
  const e1:number = transform1[4];
  const f1:number = transform1[5];
  const a2:number = transform2[0];
  const b2:number = transform2[1];
  const c2:number = transform2[2];
  const d2:number = transform2[3];
  const e2:number = transform2[4];
  const f2:number = transform2[5];

  transform1[0] = a1 * a2 + c1 * b2;
  transform1[1] = b1 * a2 + d1 * b2;
  transform1[2] = a1 * c2 + c1 * d2;
  transform1[3] = b1 * c2 + d1 * d2;
  transform1[4] = a1 * e2 + c1 * f2 + e1;
  transform1[5] = b1 * e2 + d1 * f2 + f1;

  return transform1;
}

/**
 * 设置矩阵 transform2-> transform1
 * @param transform1 
 * @param transform2 
 */
export function setFromArray(transform1:Array<number>, transform2:Array<number>):Array<number> {
  transform1[0] = transform2[0];
  transform1[1] = transform2[1];
  transform1[2] = transform2[2];
  transform1[3] = transform2[3];
  transform1[4] = transform2[4];
  transform1[5] = transform2[5];
  return transform1;
}

/**
 * 将经纬度进行矩阵转换
 * @param transform 
 * @param coordinate 
 */
export function transform(transform:Array<number>, coordinate:Array<number>):Array<number> {
  const x:number = coordinate[0];
  const y:number = coordinate[1];
  coordinate[0] = transform[0] * x + transform[2] * y + transform[4];
  coordinate[1] = transform[1] * x + transform[3] * y + transform[5];
  return coordinate;
}

/**
 * 对矩阵设置角度
 * @param transform 
 * @param angle 
 */
export function rotate(transform:Array<number>, angle:number):Array<number> {
  const cos:number = Math.cos(angle);
  const sin:number = Math.sin(angle);
  return multiply(transform, set(tmp_, cos, sin, -sin, cos, 0, 0));
}

/**
 * 对矩阵设置缩放
 * @param transform 
 * @param x 
 * @param y 
 */
export function scale(transform:Array<number>, x:number, y:number):Array<number> {
  return multiply(transform, makeScale(tmp_, x, y));
}

/**
 * 对矩阵设置平移
 * @param transform 
 * @param dx 
 * @param dy 
 */
export function translate(transform:Array<number>, dx:number, dy:number):Array<number> {
  return multiply(transform, set(tmp_, 1, 0, 0, 1, dx, dy));
}

/**
 * 复合变换
 * 平移、缩放、旋转和最终平移
 * @param transform 
 * @param dx1 平移
 * @param dy1 平移
 * @param sx 缩放
 * @param sy 缩放
 * @param angle 旋转
 * @param dx2 最终平移
 * @param dy2 最终平移
 */
export function compose(transform:Array<number>, dx1:number, dy1:number, sx:number, sy:number, angle:number, dx2:number, dy2:number):Array<number> {
  const sin:number = Math.sin(angle);
  const cos:number = Math.cos(angle);
  transform[0] = sx * cos;
  transform[1] = sy * sin;
  transform[2] = -sx * sin;
  transform[3] = sy * cos;
  transform[4] = dx2 * sx * cos - dy2 * sx * sin + dx1;
  transform[5] = dx2 * sy * sin + dy2 * sy * cos + dy1;
  return transform;
}

/**
 * 复合变换CSS(transform字段参数)
 * 平移、缩放、旋转和最终平移
 * @param dx1 
 * @param dy1 
 * @param sx 
 * @param sy 
 * @param angle 
 * @param dx2 
 * @param dy2 
 */
export function composeCssTransform( dx1:number, dy1:number, sx:number, sy:number, angle:number, dx2:number, dy2:number):string {
  return toCssString(compose(create(), dx1, dy1, sx, sy, angle, dx2, dy2));
}

/**
 * 计算行列式求逆系数
 * @param mat 
 */
export function determinant(mat:Array<number>):number {
  return mat[0] * mat[3] - mat[1] * mat[2];
}

/**
 * 是否可以求逆运算
 * @param source 
 */
export function isCanInvert(source:Array<number>):boolean {
  return determinant(source) != 0;
}

/**
 * 求逆矩阵,并覆盖目标
 * @param target 
 * @param source 
 */
export function makeInverse(target:Array<number>, source:Array<number>):Array<number> {
  const det:number = determinant(source);
  const a:number = source[0];
  const b:number = source[1];
  const c:number = source[2];
  const d:number = source[3];
  const e:number = source[4];
  const f:number = source[5];

  target[0] = d / det;
  target[1] = -b / det;
  target[2] = -c / det;
  target[3] = a / det;
  target[4] = (c * f - d * e) / det;
  target[5] = -(a * f - b * e) / det;

  return target;
}

/**
 * 求逆矩阵,并覆盖自己
 * @param source 
 */
export function invert(source:Array<number>):Array<number> {
  return makeInverse(source, source);
}
