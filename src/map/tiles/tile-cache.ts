import { Tile, TileState } from './types'
import { Map as ZKmap } from '../main/types';
export default class TilesCache {
  private _map: ZKmap;
  private _key2tile: Map<String, Tile>;
  private clearHandleTime: any;
  private historyZoom: number[] = []
  constructor(map: ZKmap) {
    this._map = map;
    this._key2tile = new Map();
  }
  add(z: number, x: number, y: number, url: string, isPc?:boolean): Tile {
    const key: string = `${z}-${x}-${y}`
    if (this._key2tile.has(key)) return this._key2tile.get(key)
    const tile: Tile = new Tile(z, x, y, url).load()
    this._key2tile.set(key, tile)
    // isPc && this.addPCTile(tile)
    return tile
  }
  get(z: number, x0: number, x1: number, y0: number, y1: number): Array<Tile> {
    if (this.historyZoom.lastIndexOf(z) === this.historyZoom.length - 1) {
      this.historyZoom.push(z)
    }
    var loadedTiles = []
    for (let ii = x0; ii < x1; ii++) {
      for (let jj = y0; jj < y1; jj++) {
        const tile:Tile = this.getTile(z,ii,jj)
        if(tile){
          if(!tile.isLoaded){
            const ptiles:Tile[] = this.getPCTile(tile)
            loadedTiles = loadedTiles.concat(ptiles)
          }else{
            loadedTiles.push(tile)
          }
        }
      }
    }
    loadedTiles.sort(function (a: Tile, b: Tile) { return a.zoom - b.zoom })
    return loadedTiles
  }
  private getPCTile(tile: Tile): Tile[]{
    const tiles:Tile[] = []
    if(tile){
      const { zoom,x,y} = tile
      for (let index = 1; index < 6; index++) {
        const  z = zoom - index
        if(z>=0){
          const y1 = Math.floor(y / Math.pow(2,index))
          const x1 = Math.floor(x / Math.pow(2,index))
          const key:string = `${z}-${x1}-${y1}`
          const tile:Tile = this._key2tile.get(key)
          tile && tile.isLoaded && tiles.push(tile)
        }
      }
      for (let index = 1; index < 2; index++) {
        const  z = zoom + index
        if(z<=22){
          const y1 = Math.floor(y * 2)
          const x1 = Math.floor(x * 2)
          const y2 = Math.floor(y * 2 + 1)
          const x2 = Math.floor(x * 2 + 1)
          const tile1:Tile = this._key2tile.get(`${z}-${x1}-${y1}`)
          const tile2:Tile = this._key2tile.get(`${z}-${x2}-${y1}`)
          const tile3:Tile = this._key2tile.get(`${z}-${x1}-${y2}`)
          const tile4:Tile = this._key2tile.get(`${z}-${x2}-${y2}`)
          tile1 && tile1.isLoaded && tiles.push(tile1)
          tile2 && tile2.isLoaded && tiles.push(tile2)
          tile3 && tile3.isLoaded && tiles.push(tile3)
          tile4 && tile4.isLoaded && tiles.push(tile4)
        }
      }
    }
    return tiles
  }
  private addPCTile(tile:Tile){
    if(tile){
      const { zoom,x,y} = tile
      for (let index = 1; index < 6; index++) {
        const  z = zoom - index
        if(z>=0){
          const y1 = Math.floor(y / Math.pow(2,index))
          const x1 = Math.floor(x / Math.pow(2,index))
          this.add(z,x1,y1, this._map.getUrl(z,x1,y1),true)
        }
      }
      // for (let index = 1; index < 2; index++) {
      //   const  z = zoom + index
      //   if(z<=22){
      //     const y1 = Math.floor(y * 2)
      //     const x1 = Math.floor(x * 2)
      //     const y2 = Math.floor(y * 2 + 1)
      //     const x2 = Math.floor(x * 2 + 1)
      //     this.add(z,x1,y1, this._map.getUrl(z,x1,y1),true)
      //     this.add(z,x2,y1, this._map.getUrl(z,x2,y1),true)
      //     this.add(z,x1,y2, this._map.getUrl(z,x1,y2),true)
      //     this.add(z,x2,y2, this._map.getUrl(z,x2,y2),true)
      //   }
      // }
    }
  }
  private getTile(z: number, x: number, y: number):Tile {
    const key:string = `${z}-${x}-${y}`
    return this._key2tile.has(key) ? this._key2tile.get(key) : null
  }
  isFinishZoom(z: number, x0: number, x1: number, y0: number, y1: number): boolean {
    const loadedTiles = []
    for (let ii = x0; ii < x1; ii++) {
      for (let jj = y0; jj < y1; jj++) {
        const key: string = `${z}-${ii}-${jj}`
        const tile: Tile = this._key2tile.get(key)
        if (!tile || !tile.isFinish) {
          return false
        }
      }
    }
    return true
  }
  clearNoneTiles(z: number) {
    if (this.clearHandleTime) {
      window.clearTimeout(this.clearHandleTime)
    }
    this.clearHandleTime = setTimeout(() => {
      const deleteArray: Array<String> = new Array();
      this._key2tile.forEach((value: Tile, key: String, map: Map<String, Tile>) => {
        value.zoom !== z && value.state == TileState.NONE && deleteArray.push(key)
      })
      deleteArray.forEach(item => {
        this._key2tile.get(item).destroy()
        this._key2tile.delete(item)
      })
    }, 30);
  }
  private getLoadTile(z: number, x: number, y: number): Tile {
    let tile: Tile = null
    const key: string = `${z}-${x}-${y}`
    if (this._key2tile.has(key)) {
      this.historyZoom
      const tileTmp = this._key2tile.get(key)
      if (tileTmp.isLoaded) {
        tile = tileTmp
      } else {
        const maxIndex = this.historyZoom.length - 1
        if (maxIndex < 1) {
          return null;
        }
        var keys: Array<String>
        if (this.historyZoom.length[maxIndex] - this.historyZoom.length[maxIndex - 1] > 0) {
          keys = tileTmp.getChildrenKeys()
        } else {
          keys = tileTmp.getParentKeys()
        }
        for (let index = 0; index < keys.length; index++) {
          const key = keys[index];
          const parent: Tile = this._key2tile.get(key)
          if (!!parent && parent.isLoaded) {
            tile = parent
            break;
          }
        }
      }
    }
    return tile
  }
}