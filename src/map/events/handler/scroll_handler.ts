import { Handler, HandlerResult, EventHandlerManager } from '../types'
import { Map } from '../../main/types'
import { Point } from '../../geo/types'
import Utils from "../../utils";
export default class ScrollHandler implements Handler {
  private _map:Map
  private _handler:EventHandlerManager
  private _enabled: boolean;
  private _active: boolean;
  private _lastEventTime: number;
  private _lastEvent: any;
  private _delta: number;
  private _zooming: boolean;
  private _startZoom?: number;
  private _easing?: (_:number) => number;
  private _aroundPoint: Point;
  private _targetZoom?: number;
  private _type: 'wheel' | 'trackpad' | null;
  private _timeout?: any;
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
  isActive(): boolean { return !!this._active };
  reset(): void {
    this._active = false;
  };
  wheel(e: WheelEvent, point: Point):HandlerResult | void{
    console.log('ScrollHandler.wheel',e.deltaMode)
    let value = e.deltaMode === window.WheelEvent.DOM_DELTA_LINE ? e.deltaY * 40 : e.deltaY;
    const sensitivity = 100;
    const delta = -e.deltaY / sensitivity /5
    const now = Utils.Browser.now(), timeDelta = now - (this._lastEventTime || 0);
    this._lastEventTime = now;
    
    if (timeDelta > 400) {
          this._type = null;
    } else if (!this._type) {
      this._type = (Math.abs(timeDelta * value) < 200) ? 'trackpad' : 'wheel';
      if (this._timeout) {
        clearTimeout(this._timeout);
        this._timeout = null;
      }
    }
    this._delta -= value;
    if (!this._active) {
        this._start(e);
    }
    e.preventDefault();
  }
  _start(e: any) {
    this._active = true;
    this._zooming = true;
    this._lastEvent = e;
    this._aroundPoint =  new Point(e.x,e.y)
    this._handler._triggerRenderFrame();
  }
  renderFrame():HandlerResult {
    return this._onScrollFrame();
  }
  _onScrollFrame():HandlerResult {
    if (!this.isActive()) return;
    const tr = this._map.transform;
    if (this._delta !== 0) {
      let scale =  this._delta / 500
      this._targetZoom = Math.min(tr.maxZoom, Math.max(tr.minZoom, tr.zoom + scale));
      if (this._type === 'wheel') {
          this._startZoom = tr.zoom;
          this._easing = this._smoothOutEasing(200);
      }
      this._delta = 0;
    }
    const targetZoom = typeof this._targetZoom === 'number' ? this._targetZoom : tr.zoom;
    const startZoom = this._startZoom;
    const easing = this._easing;
    let finished = false;
    let zoom;
    
    if (this._type === 'wheel' && startZoom && easing) {
      const t = Math.min((Utils.Browser.now() - this._lastEventTime) / 200, 1);
      const k = easing(t);
      zoom = (targetZoom - startZoom) * k + startZoom;
      if (t >= 1) {
          finished = true;
      }
    } else {
        zoom = targetZoom;
        finished = true;
    }
    this._active = true;
    if (finished) {
        this._active = false;
        this._handler._triggerRenderFrame();
        this._zooming = false;
    }
    return {
        renderFrame: !finished,
        targetZoom: zoom,
        around: this._aroundPoint,
        originalEvent: this._lastEvent
    };
  }
  _smoothOutEasing(time:number):(_:number) => number{
    return (time:number)=>{ return time}
  }
}