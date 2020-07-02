import { Handler, HandlerResult } from '../types'
import { Point } from '../../geo/types'
export default class MouseHandler implements Handler {
  private _dragFlag: boolean;
  private _start: any = {};
  constructor() {}
  enable(): void{};
  disable(): void{};
  isEnabled(): boolean{ return true };
  isActive(): boolean{ return true };
  reset(): void{};
  mousedown(e: MouseEvent, point: Point):HandlerResult | void{
    this._dragFlag = true
    this._start.x = e.x;
    this._start.y = e.y;
  };
  mousemove(e: MouseEvent, point: Point):HandlerResult | void{
    if (this._dragFlag) {
      console.log([e.x - this._start.x,e.y - this._start.y])
    }
  };
  mouseup(e: MouseEvent, point: Point):HandlerResult | void{
    this._dragFlag = false
  };
}