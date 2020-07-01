import { Handler, HandlerResult } from '../types'
import { Point } from '../../geo/types'
export default class MouseHandler implements Handler {
  constructor() {}
  enable(): void{};
  disable(): void{};
  isEnabled(): boolean{ return true };
  isActive(): boolean{ return true };
  reset(): void{};
  mousedown(e: MouseEvent, point: Point):HandlerResult | void{
    // console.log('MouseHandler.mousedown')
  };
  mousemove(e: MouseEvent, point: Point):HandlerResult | void{
    // console.log('MouseHandler.mousemove')
  };
  mouseup(e: MouseEvent, point: Point):HandlerResult | void{
    // console.log('MouseHandler.mouseup')
  };
}