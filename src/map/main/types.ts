import type { LngLat } from '../geo/types';

export type MapOptions = {
  container: HTMLElement | string,
  center?: LngLat,
  zoom?: number,
  minZoom?: number,
  maxZoom?: number,
  type: string
};