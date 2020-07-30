import { ISource,TilesCache, RasterTile,Tile,SourceResult,SourceOption } from './types'
import { URL } from '../com/types';
export default class RasterSource implements ISource {
  private _id: String;
  private _tilesCache :TilesCache;
  private _mapLoadingTile:Map<String,RasterTile>;
  private _lstParentTile: Array<RasterTile>;
  private _lstChildTile: Array<RasterTile>;
  private _lstCurTile: Array<RasterTile>;
  private _url: URL;
  constructor(option:SourceOption) {
    this._id = option.id
    this._url = new URL(option.url,option.scheme)
    this._tilesCache = new TilesCache(1000)
    this._mapLoadingTile = new Map<String,RasterTile>()
    this._lstParentTile = new Array<RasterTile>()
    this._lstChildTile = new Array<RasterTile>()
    this._lstCurTile = new Array<RasterTile>()
  }
  get id():String {
    return this._id;
  }
  refresh(): void{}
  getData(z: number, xStart: number, xEnd: number, yStart: number, yEnd: number): SourceResult{
    for (let x = xStart; x < xEnd; x++) {
      for (let y = yStart; y < yEnd; y++) {
        const url = this._url.getUrl(z,x,y)
        if(this._mapLoadingTile.has(url)){
          continue;
        }

        if(this._tilesCache.has(url)){
          this._lstCurTile.push(<RasterTile>this._tilesCache.get(url))
        }else{
          const raster: RasterTile = new RasterTile(z, x, y, url).load().then((tile:Tile) => {
            this._tilesCache.add(tile)
            this._mapLoadingTile.delete(tile.id)
          })
          this._mapLoadingTile.set(raster.id,raster)
          this._lstParentTile = this._findParentTile(raster)
          this._lstChildTile = this._findChildTiles(raster)
        }
      }
    }
    return {
      tile_cur: this._lstCurTile,
      tile_parent: this._lstParentTile,
      tile_child: this._lstChildTile
    }
  }
  private _findParentTile(raster: RasterTile):RasterTile[] {
    const rasterTiles: RasterTile[] = []
    if(raster){
      const { z,x,y} = raster
      for (let index = 1; index < 6; index++) {
        const  zoom = z - index
        if(zoom>=0){
          const y1 = Math.floor(y / Math.pow(2,index))
          const x1 = Math.floor(x / Math.pow(2,index))
          const url:string = this._url.getUrl(z,x,y)
          if(this._tilesCache.has(url)){
            const rasterTile:RasterTile = <RasterTile>this._tilesCache.get(url)
            rasterTiles.push(rasterTile)
          }
        }
      }
    }
    return rasterTiles
  }
  private _findChildTiles(raster: RasterTile):RasterTile[] {
    const rasterTiles: RasterTile[] = []
    if(raster){
      const { z,x,y} = raster
      for (let index = 1; index < 2; index++) {
        const  zoom = z + index
        if(z<=22){
          const y1 = Math.floor(y * 2)
          const x1 = Math.floor(x * 2)
          const y2 = Math.floor(y * 2 + 1)
          const x2 = Math.floor(x * 2 + 1)
          var url:string = this._url.getUrl(zoom,x1,y1)
          if(this._tilesCache.has(url)){
            const rasterTile:RasterTile = <RasterTile>this._tilesCache.get(url)
            rasterTiles.push(rasterTile)
          }
          url = this._url.getUrl(zoom,x2,y1)
          if(this._tilesCache.has(url)){
            const rasterTile:RasterTile = <RasterTile>this._tilesCache.get(url)
            rasterTiles.push(rasterTile)
          }
          url = this._url.getUrl(zoom,x1,y2)
          if(this._tilesCache.has(url)){
            const rasterTile:RasterTile = <RasterTile>this._tilesCache.get(url)
            rasterTiles.push(rasterTile)
          }
          url = this._url.getUrl(zoom,x2,y2)
          if(this._tilesCache.has(url)){
            const rasterTile:RasterTile = <RasterTile>this._tilesCache.get(url)
            rasterTiles.push(rasterTile)
          }
        }
      }
    }
    return rasterTiles
  }

}