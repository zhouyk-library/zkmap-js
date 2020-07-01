import {Point} from '../geo/types'
import { Map } from '../main/types'
import Event from './event';
import ErrorEvent from './error_event';
import Evented from './evented';
import EventHandlerManager from './Event_handler_manager';
import Handler from './handler/handler';
import MouseHandler from './handler/mouse_handler';
import ScrollHandler from './handler/scroll_handler';
export interface ErrorLike {
  message: string;
}
export type Listener = (Object) => any;
export type Listeners = { [_: string]: Array<Listener> };

export type InputEvent = MouseEvent | WheelEvent;

export {
  Event,
  ErrorEvent,
  Evented,
  EventHandlerManager,
  Handler,
  MouseHandler,
  ScrollHandler
}

export type HandlerResult = {
  around?: Point | null,
  renderFrame?: Boolean,
  targetZoom?: Point,
  originalEvent?: any
};