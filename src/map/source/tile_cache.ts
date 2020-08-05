import { Tile } from './types'
/**
 * 最近优先缓存
 */
export default class TilesCache {
  private _key2tile: Map<String, Tile>;
  private _order: Array<String>;
  private _max: number;
  constructor(max: number) {
      this._max = max;
      this.reset();
  }
  reset(): TilesCache{
    this._order = new Array<String>()
    this._key2tile = new Map<String, Tile>()
    return this;
  }
  clear(): void {
    this.reset();
  }
  add(tile: Tile): TilesCache {
    const id:String = tile.id;
    if (this.has(id)) {
        this._order.splice(this._order.indexOf(id), 1);
        this._key2tile.set(id,tile);
        this._order.push(id);

    } else {
        this._key2tile.set(id,tile);
        this._order.push(id);

        if (this._order.length > this._max) {
          this._key2tile.delete(this._order.splice(0, 1)[0])
        }
    }
    return this;
  }
  has(key:String): boolean {
    return this._key2tile.has(key)
  }
  get(key:String): Tile | null {
    if (!this.has(key)) { return null; }
    return this._key2tile.get(key);
  }
}