import { Map } from '../main/types'
import { InputEvent, Handler, ScrollHandler, MouseHandler, HandlerResult } from './types'
import Utils from "../utils";
import Point from '../geo/point';

export default class EventHandlerManager {
  private _map: Map;
  private _el: HTMLElement;
  private _frameId: number;
  private _handlers: Array<{ handlerName: string, handler: Handler, allowed: Array<string> }> = new Array();
  private _listeners: Array<[HTMLElement | Window | Document, string, { passive?: boolean, capture?: boolean }]>;
  constructor(map: Map) {
    this._map = map;
    const el = this._el = this._map.getCanvasContainer();
    this.initDefaultHandlers()
    this._listeners = [
      [el, 'mousedown', undefined],
      [el, 'mousemove', undefined],
      [el, 'mouseup', undefined],
      [window.document, 'mousemove', { capture: true }],
      [window.document, 'mouseup', undefined],
      [el, 'mouseover', undefined],
      [el, 'mouseout', undefined],
      [el, 'dblclick', undefined],
      [el, 'click', undefined],
      [el, 'keydown', { capture: false }],
      [el, 'keyup', undefined],
      [el, 'wheel', { passive: false }],
      [window, 'blur', undefined]
    ];

    for (const [target, type, listenerOptions] of this._listeners) {
      Utils.DOM.addEventListener(target, type, this.handleEvent.bind(this), listenerOptions);
    }
  }
  handleEvent(e: InputEvent | any) {
    const type = e.type
    if (type === 'blur') {
      this.stop();
      return;
    }
    this.computedRenderFrame(e, type)
  }
  initDefaultHandlers() {
    this.addHandler('scrollZoom', new ScrollHandler(this._map, this), ['wheel']);
    this.addHandler('mousePan', new MouseHandler(this._map, this), ['mousemove', 'mouseup', 'mousedown']);

    for (const { handler } of this._handlers) {
      handler.enable();
    }
  }
  addHandler(handlerName: string, handler: Handler, allowed?: Array<string>) {
    this._handlers.push({ handlerName, handler, allowed });
  }
  stop(): void {
    for (const { handler } of this._handlers) {
      handler.reset();
    }
  }
  computedRenderFrame(e: InputEvent | any, type: string, timeStamp?: number): void {
    const points = new Point(e.x, e.y)
    for (const { handlerName, handler, allowed } of this._handlers) {
      if (!handler.isEnabled()) continue;
      let data: HandlerResult | void;
      if (handler[type]) {
        data = handler[type](e, points);
        if (data) {
          if (!!data.around) this._map.transform.anchorPoint = data.around.toArray()
          if (!!data.targetZoom) this._map.transform.zoom = data.targetZoom
          if (!!data.dragDelta) this._map.transform.moveCenter(data.dragDelta.toArray())
          this._map._render.computed()
          if (data.renderFrame) {
            this.triggerRenderFrame()
          }
          if (handlerName === 'mousePan') {
            this._map._update()
          }
        }
      }
    }
  }
  updateTransform(timeStamp: number): void {
    // this.transform.anchorPoint = [event.x,event.y]
    // this.transform.zoom = this.transform.zoom + delta
  }
  triggerRenderFrame() {
    if (this._frameId === undefined) {
      this._frameId = this._map._requestRenderFrame((timeStamp: number) => {
        delete this._frameId;
        this.computedRenderFrame({}, 'renderFrame', timeStamp);
        this.updateTransform(timeStamp);
      });
    }
  }
}