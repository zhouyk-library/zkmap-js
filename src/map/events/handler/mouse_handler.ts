import { Handler, HandlerResult, EventHandlerManager } from '../types'
import { Map } from '../../main/types'
import { Point } from '../../geo/types'
export default class MouseHandler implements Handler {
  private _map: Map
  private _handler: EventHandlerManager
  private _enabled: boolean;
  private _active: boolean;
  private _start: Point;
  constructor(map: Map, handler: EventHandlerManager) {
    this._map = map;
    this._handler = handler;
  }
  enable(): void {
    if (this.isEnabled()) return;
    this._enabled = true;
  };
  disable(): void {
    if (!this.isEnabled()) return;
    this._enabled = false;
  };
  isEnabled(): boolean { return !!this._enabled };
  isActive(): boolean { return this._active };
  reset(): void {
    this._active = false;
    delete this._start
  };
  mousedown(e: MouseEvent, point: Point): HandlerResult | void {
    this._active = true
    this._start = point;
  };
  mousemove(e: MouseEvent, point: Point): HandlerResult | void {
    if (this._active) {
      const dragDelta = point.sub(this._start)
      this._start = point
      return {
        dragDelta: dragDelta,
        originalEvent: e
      }
    }
  };
  mouseup(e: MouseEvent, point: Point): HandlerResult | void {
    this._active = false
  };
}