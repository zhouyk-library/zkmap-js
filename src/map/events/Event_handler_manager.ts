import { Map } from '../main/types'
import { InputEvent, Handler, ScrollHandler, MouseHandler, HandlerResult } from './types'
import Utils from "../utils";
import Point from '../geo/point';
export default class EventHandlerManager {
  private _map: Map;
  private _el: HTMLElement;
  private _handlers: Array<{ handlerName: string, handler: Handler, allowed:  Array<string> }> = new Array();
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
  handleEvent(e: InputEvent, eventName?: string) {
    const type = e.type
    if (e.type === 'blur') {
        this.stop();
        return;
    }
    const points =  new Point(e.x,e.y)
    for (const {handler, allowed} of this._handlers) {
      if (!handler.isEnabled()) continue;
      if (allowed.includes(type)) {
        handler[type](e, points);
      }
    }
  }
  initDefaultHandlers(){
    this.addHandler('scrollZoom', new ScrollHandler(this._map,this), ['wheel']);
    this.addHandler('mousePan', new MouseHandler(), ['mousemove','mouseup','mousedown']);
    
    for (const {handler} of this._handlers) {
      handler.enable();
    }
  }
  addHandler(handlerName: string, handler: Handler, allowed?: Array<string>) {
    this._handlers.push({handlerName, handler, allowed});
  }
  stop():void{
    for (const {handler} of this._handlers) {
      handler.reset();
    }
  }
  renderFrame(){
    for (const {handler, allowed} of this._handlers) {
      let data: HandlerResult | void;
      if (!handler.isEnabled()) continue;
      data = handler.renderFrame();
    }
  }
  _triggerRenderFrame(){

  }
}