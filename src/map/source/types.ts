
import RasterSource from './raster_source';
import TilesCache from './tile_cache';
import RasterTile from './raster/raster_tile';
import Source from './source';
export {Source,RasterSource,TilesCache,RasterTile}
export enum TileState{NONE=0,LOADING=2,OK=1,ERROR=-1}
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