import { Source,TilesCache, RasterTile,Tile } from './types'
export default class RasterSource implements Source {
  private _tilesCache :TilesCache;
  private _mapLoadingTile:Map<String,RasterTile>;
  constructor() {
    this._tilesCache = new TilesCache(1000)
    this._mapLoadingTile = new Map<String,RasterTile>()
  }
  clear(): void{
  }
  refresh(): void{
  }
  getData(z: number, x: number, y: number, url: string): RasterTile{
    if(this._tilesCache.has(url)){
      return <RasterTile>this._tilesCache.get(url)
    }
    const raster: RasterTile = new RasterTile(z, x, y, url).load().then((tile:Tile)=>{
      this._tilesCache.add(tile)
      this._mapLoadingTile.delete(tile.id)
    })
    this._mapLoadingTile.set(raster.id,raster)
  }
}