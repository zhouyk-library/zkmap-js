import {Tile,TileState} from './types'
export default class TilesCache {
  private _tiles:Array<Tile>;
  private _key2tile:Map<String,Tile>;
  constructor() {
    this._tiles = new Array();
    this._key2tile = new Map();
  }
  loadTiles(){
    this._tiles.filter((item:Tile)=>item.state === TileState.NONE).forEach((item:Tile)=>{
      item.load()
    })
  }
  add(z: number, x: number, y: number, url: string){
    const key:string = `${z}-${x}-${y}`
    if(this._key2tile.has(key)) return
    const tile:Tile = new Tile(z,x,y,url).load()
    this._tiles.push(tile)
    this._key2tile.set(key,tile)
  }
  get(z: number, x0: number,x1: number, y0: number, y1: number):Array<Tile>{
    const loadedTiles = []
    for (let ii = x0; ii <= x1; ii++) {
      for (let jj = y0; jj <= y1; jj++) {
        const tile:Tile = this.getLoadTile(z,ii,jj)
        tile && loadedTiles.push(tile)
      }
    }
    loadedTiles.sort(function(a:Tile, b:Tile){return a.zoom - b.zoom})
    return loadedTiles
  }
  isAllFinishToZoom(z: number):boolean{
    return this._tiles.filter(tile=> tile.zoom === z && !tile.isFinish).length === 0
  }
  private getLoadTile(z: number, x: number, y: number):Tile{
    let tile:Tile = null
    const key:string = `${z}-${x}-${y}`
    if(this._key2tile.has(key)){
      const tileTmp = this._key2tile.get(key)
      if(tileTmp.isLoaded){
        tile = tileTmp
      }else{
        // return null;
        const keys:Array<String> = tileTmp.getParentKeys()
        for (let index = 0; index < keys.length; index++) {
          const key = keys[index];
          const parent:Tile = this._key2tile.get(key)
          if(!!parent && parent.isLoaded){
            tile = parent
            break;
          }
        }
      }
    }
    return tile
  }
}