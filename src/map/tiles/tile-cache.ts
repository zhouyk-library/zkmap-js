import { Tile, TileState } from './types'
export default class TilesCache {
  private _key2tile: Map<String, Tile>;
  private clearHandleTime: any;
  private historyZoom: number[] = []
  constructor() {
    this._key2tile = new Map();
  }
  add(z: number, x: number, y: number, url: string): Tile {
    const key: string = `${z}-${x}-${y}`
    if (this._key2tile.has(key)) return this._key2tile.get(key)
    const tile: Tile = new Tile(z, x, y, url).load()
    this._key2tile.set(key, tile)
    return tile;
  }
  get(z: number, x0: number, x1: number, y0: number, y1: number): Array<Tile> {
    if (this.historyZoom.lastIndexOf(z) === this.historyZoom.length - 1) {
      this.historyZoom.push(z)
    }
    const loadedTiles = []
    for (let ii = x0; ii < x1; ii++) {
      for (let jj = y0; jj < y1; jj++) {
        const tile: Tile = this.getLoadTile(z, ii, jj)
        tile && loadedTiles.push(tile)
      }
    }
    loadedTiles.sort(function (a: Tile, b: Tile) { return a.zoom - b.zoom })
    return loadedTiles
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