import Event from './event';
import ErrorEvent from './error_event';
import Evented from './evented';
import EventHandlerManager from './Event_handler_manager';
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
  EventHandlerManager
}