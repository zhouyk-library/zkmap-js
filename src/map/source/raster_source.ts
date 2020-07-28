import { Source,TilesCache, RasterTile,Tile,SourceResult } from './types'
export default class RasterSource implements Source {
  private _tilesCache :TilesCache;
  private _mapLoadingTile:Map<String,RasterTile>;
  private _lstParentTile: Array<RasterTile>;
  private _lstChildTile: Array<RasterTile>;
  private _lstCurTile: Array<RasterTile>;
  constructor() {
    this._tilesCache = new TilesCache(1000)
    this._mapLoadingTile = new Map<String,RasterTile>()
    this._lstParentTile = new Array<RasterTile>()
    this._lstChildTile = new Array<RasterTile>()
    this._lstCurTile = new Array<RasterTile>()
  }
  clear(): void{
  }
  refresh(): void{
  }
  getData(z: number, x0: number, x1: number, y0: number, y1: number): SourceResult{
    for (let x = x0; x < x1; x++) {
      for (let y = y0; y < y1; y++) {
        const url = ""
        if(this._tilesCache.has(url)){
          this._lstCurTile.push(<RasterTile>this._tilesCache.get(url))
        }else{
          const raster: RasterTile = new RasterTile(z, x, y, url).load().then((tile:Tile) => {
            this._tilesCache.add(tile)
            this._mapLoadingTile.delete(tile.id)
          })
          this._mapLoadingTile.set(raster.id,raster)
        }
      }
    }
    return {
      cur:this._lstCurTile,
      parent:this._lstParentTile,
      child:this._lstChildTile
    }
  }
}