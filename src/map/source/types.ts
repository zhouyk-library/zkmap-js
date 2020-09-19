import RasterSource from './raster_source';
import Sources from './sources';
import TilesCache from './tile_cache';
import RasterTile from './raster/raster_tile';
import { Transform, Bound } from '../geo/types';
export { RasterSource, TilesCache, RasterTile, Sources }
export enum TileState { NONE = 0, LOADING = 2, OK = 1, ERROR = -1 }
export type SourceResult = {
  tile_cur?: Tile[],
  tile_parent?: Tile[],
  tile_child?: Tile[],
  coordinates?: number[][],
  bound?: Bound
}

export interface Tile {
  load(): Tile | any;
  then(done: (_: Tile | any) => void): void;
  error(error: (_: Tile | any) => void): void;
  destroy(): void;
  isLoaded: Boolean;
  isFinish: Boolean;
  state: TileState;
  z: number;
  x: number;
  y: number;
  image: CanvasImageSource;
  dx: number;
  dy: number;
  dw: number;
  dh: number
  time: number;
  xyz: string;
  id: string;
}

export interface ISource {
  id: String;
  refresh(): void;
  getData(transform: Transform, bound: Bound): SourceResult;
}

export type SourceOption = {
  id: string;
  type: string;
  url?: string;
  tileSize?: number;
  scheme?: string
}