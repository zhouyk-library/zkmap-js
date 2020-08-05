import type { LngLat } from '../geo/types';
import type { LayerOption } from '../layer/types';
import type { SourceOption } from '../source/types';

export type MapOptions = {
  container: HTMLElement | string,
  center?: LngLat,
  zoom?: number,
  minZoom?: number,
  maxZoom?: number,
  type: string,
  source?:SourceOption[],
  layer?:LayerOption[]
};
import Map from './map';
export {
  Map
}