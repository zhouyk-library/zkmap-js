import Event from './event';
import ErrorEvent from './error_event';
import Evented from './evented';
export interface ErrorLike {
  message: string;
}
export type Listener = (Object) => any;
export type Listeners = { [_: string]: Array<Listener> };

export {
  Event,
  ErrorEvent,
  Evented
}