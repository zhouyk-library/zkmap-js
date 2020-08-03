import { ISource, TilesCache, RasterTile, Tile, SourceResult, SourceOption } from './types'
import { URL } from '../com/types';
import { Transform, Bound } from '../geo/types';
export default class RasterSource implements ISource {
  private _id: String;
  private _tilesCache: TilesCache;
  private _mapLoadingTile: Map<String, RasterTile>;
  private _lstParentTile: Array<RasterTile>;
  private _lstChildTile: Array<RasterTile>;
  private _lstCurTile: Array<RasterTile>;
  private _url: URL;
  private _tileSize: number = 256;
  constructor(option: SourceOption) {
    this._id = option.id
    this._url = new URL(option.url, option.scheme)
    this._tileSize = option.tileSize || this._tileSize
    this._tilesCache = new TilesCache(1000)
    this._mapLoadingTile = new Map<String, RasterTile>()
    this._lstParentTile = new Array<RasterTile>()
    this._lstChildTile = new Array<RasterTile>()
    this._lstCurTile = new Array<RasterTile>()
  }
  get id(): String {
    return this._id;
  }
  refresh(): void { }
  getData(transform: Transform, bound: Bound): SourceResult {
    const z = transform.zoomInt
    const allCount = Math.pow(2, z)
    const outXEnd = transform.width, outXStart = 0, outYEnd = transform.height, outYStart = 0
    const inXStart = bound.xmin, inYStart = bound.ymin, inXEnd = bound.xmax, inYEnd = bound.ymax
    const countX = inXEnd - inXStart
    const countY = inYEnd - inYStart
    const xstart = Math.floor(allCount / countX * (Math.max(inXStart, outXStart) - inXStart))
    const xend = Math.ceil(allCount / countX * (Math.min(inXEnd, outXEnd) - inXStart))
    const ystart = Math.floor(allCount / countY * (Math.max(inYStart, outYStart) - inYStart))
    const yend = Math.ceil(allCount / countY * (Math.min(inYEnd, outYEnd) - inYStart))
    this._lstCurTile.splice(0)
    this._lstParentTile.splice(0)
    this._lstChildTile.splice(0)
    const lstParentTile = new Array<string>()
    const lstLoadingTile: Array<String> = new Array<String>()
    for (let x = xstart; x < xend; x++) {
      for (let y = ystart; y < yend; y++) {
        const url = this._url.getUrl(z, x, y)
        if (this._mapLoadingTile.has(url)) {
          lstLoadingTile.push(url)
          continue;
        }
        const size = this._tileSize * Math.pow(2, transform.zoom - z)
        const screenX = x * size + inXStart;
        const screenY = y * size + inYStart;
        if (this._tilesCache.has(url)) {
          this._lstCurTile.push(this.setTilesTransfrom(<RasterTile>this._tilesCache.get(url), screenX, screenY, size))
        } else {
          const raster: RasterTile = new RasterTile(z, x, y, url).load().then((tile: Tile) => {
            this._tilesCache.add(tile)
            this._mapLoadingTile.delete(tile.id)
          }).error((tile: Tile) => {
            console.log(tile.id);

            this._mapLoadingTile.delete(tile.id)
          })
          this.setTilesTransfrom(raster, screenX, screenY, size)
          this._mapLoadingTile.set(raster.id, raster)
          lstLoadingTile.push(raster.id)
          this._findParentTile(raster).forEach(item => {
            if (!lstParentTile.includes(item.id)) {
              lstParentTile.push(item.id)
              this.setRasterTileTransfrom(item, transform, inXStart, inYStart)
              this._lstParentTile.push(item)
            }
          })
          this._findChildTiles(raster).forEach(item => {
            this.setRasterTileTransfrom(item, transform, inXStart, inYStart)
            this._lstChildTile.push(item)
          })
        }
      }
    }

    Array.from(this._mapLoadingTile.keys()).forEach(tileId => {
      if (!lstLoadingTile.includes(tileId)) {
        this._mapLoadingTile.get(tileId).destroy()
        this._mapLoadingTile.delete(tileId)
      }
    })
    return {
      tile_cur: this._lstCurTile,
      tile_parent: this._lstParentTile,
      tile_child: this._lstChildTile
    }
  }
  private setRasterTileTransfrom(raster: RasterTile, transform: Transform, inXStart: number, inYStart: number): RasterTile {
    const size = this._tileSize * Math.pow(2, transform.zoom - raster.z)
    const dx = raster.x * size + inXStart;
    const dy = raster.y * size + inYStart;
    this.setTilesTransfrom(raster, dx, dy, size)
    return raster;

  }
  private setTilesTransfrom(raster: RasterTile, dx: number, dy: number, size: number): RasterTile {
    raster.transfroms(dx, dy, size, size)
    return raster;

  }
  private _findParentTile(raster: RasterTile): RasterTile[] {
    const rasterTiles: RasterTile[] = []
    if (raster) {
      const { z, x, y } = raster
      for (let index = 1; index < 6; index++) {
        const zoom = z - index
        if (zoom >= 0) {
          const y1 = Math.floor(y / Math.pow(2, index))
          const x1 = Math.floor(x / Math.pow(2, index))
          const url: string = this._url.getUrl(z, x1, y1)
          if (this._tilesCache.has(url)) {
            const rasterTile: RasterTile = <RasterTile>this._tilesCache.get(url)
            rasterTiles.push(rasterTile)
          }
        }
      }
    }
    return rasterTiles
  }
  private _findChildTiles(raster: RasterTile): RasterTile[] {
    const rasterTiles: RasterTile[] = []
    if (raster) {
      const { z, x, y } = raster
      for (let index = 1; index < 2; index++) {
        const zoom = z + index
        if (z <= 22) {
          const y1 = Math.floor(y * 2)
          const x1 = Math.floor(x * 2)
          const y2 = Math.floor(y * 2 + 1)
          const x2 = Math.floor(x * 2 + 1)
          var url: string = this._url.getUrl(zoom, x1, y1)
          if (this._tilesCache.has(url)) {
            const rasterTile: RasterTile = <RasterTile>this._tilesCache.get(url)
            rasterTiles.push(rasterTile)
          }
          url = this._url.getUrl(zoom, x2, y1)
          if (this._tilesCache.has(url)) {
            const rasterTile: RasterTile = <RasterTile>this._tilesCache.get(url)
            rasterTiles.push(rasterTile)
          }
          url = this._url.getUrl(zoom, x1, y2)
          if (this._tilesCache.has(url)) {
            const rasterTile: RasterTile = <RasterTile>this._tilesCache.get(url)
            rasterTiles.push(rasterTile)
          }
          url = this._url.getUrl(zoom, x2, y2)
          if (this._tilesCache.has(url)) {
            const rasterTile: RasterTile = <RasterTile>this._tilesCache.get(url)
            rasterTiles.push(rasterTile)
          }
        }
      }
    }
    return rasterTiles
  }

}