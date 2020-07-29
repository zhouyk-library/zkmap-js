import RasterSource from './raster_source';
import Sources from './sources';
import TilesCache from './tile_cache';
import RasterTile from './raster/raster_tile';
export {RasterSource,TilesCache,RasterTile,Sources}
export enum TileState{NONE=0,LOADING=2,OK=1,ERROR=-1}
export type SourceResult = {
  tile_cur?:Tile[],
  tile_parent?:Tile[],
  tile_child?:Tile[]
}

export interface Tile {
  load():Tile | any;
  then(done: (_: Tile| any) => void):void;
  destroy():void;
  isLoaded: Boolean;
  isFinish: Boolean;
  state: TileState;
  z: number;
  x: number;
  y: number;
  image: HTMLImageElement | ImageBitmap | HTMLCanvasElement;
  time:number;
  xyz:string;
  id:string;
}

export interface ISource {
  id: String;
  refresh(): void;
  getData(z: number, x0: number, x1: number, y0: number, y1: number): any;
}

export type SourceOption = {
  id:String;
  type:String;
  url?:String;
}