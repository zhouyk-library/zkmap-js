import {Point} from '../../geo/types'
import {HandlerResult} from '../types'
export default interface Handler {
  enable(): void;
  disable(): void;
  isEnabled(): boolean;
  isActive(): boolean;
  reset(): void;
  touchstart?: (e: TouchEvent, points: Array<Point>, mapTouches: Array<Touch>) => HandlerResult | void;
  touchmove?: (e: TouchEvent, points: Array<Point>, mapTouches: Array<Touch>) => HandlerResult | void;
  touchend?: (e: TouchEvent, points: Array<Point>, mapTouches: Array<Touch>) => HandlerResult | void;
  touchcancel?: (e: TouchEvent, points: Array<Point>, mapTouches: Array<Touch>) => HandlerResult | void;
  mousedown?: (e: MouseEvent, point: Point) => HandlerResult | void;
  mousemove?: (e: MouseEvent, point: Point) => HandlerResult | void;
  mouseup?: (e: MouseEvent, point: Point) => HandlerResult | void;
  dblclick?: (e: MouseEvent, point: Point) => HandlerResult | void;
  wheel?: (e: WheelEvent, point: Point) => HandlerResult | void;
  keydown?: (e: KeyboardEvent) => HandlerResult | void;
  keyup?: (e: KeyboardEvent) => HandlerResult | void;
  renderFrame?: () => HandlerResult | void;
}