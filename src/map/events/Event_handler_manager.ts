import { Map } from '../main/types'
import { InputEvent } from './types'
import Utils from "../utils";
export default class EventHandlerManager {
  private _map: Map;
  private _el: HTMLElement;
  private _listeners: Array<[HTMLElement | Window | Document, string, { passive?: boolean, capture?: boolean }]>;
  constructor(map: Map) {
    this._map = map;
    const el = this._el = this._map.getCanvasContainer();
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
      Utils.DOM.addEventListener(target, type, this.handleEvent, listenerOptions);
    }

  }
  handleEvent(e: InputEvent, eventName?: string) {
    console.dir(e)
  }
}