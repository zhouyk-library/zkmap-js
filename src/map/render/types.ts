import Context from './context';
import Painter from './painter';
export { Context, Painter }

export type PointPaint = {
  fillStyle?: string,
  strokeStyle?: string,
  radius?: number,
  lineWidth?: number,
  opacity?: number
}
export type LinePaint = {
  width?: number,
  color?: string,
  opacity?: number
}
export type PolygonPaint = {
  color?: string,
  opacity?: number
}
export type Paint = {
  point?: PointPaint,
  line?: LinePaint,
  polygon?: PolygonPaint
}