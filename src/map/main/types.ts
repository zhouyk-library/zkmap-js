import type { LngLat } from '../geo/types';
export { Event } from './events';
// events
export interface ErrorLike {
  message: string;
}
export type Listener = (Object) => any;
export type Listeners = { [_: string]: Array<Listener> };

export type MapOptions = {
  container: HTMLElement | string,
  center?: LngLat,
  zoom?: number,
  minZoom?: number,
  maxZoom?: number,
  type: string
};
export type Cancelable = { cancel: () => void };