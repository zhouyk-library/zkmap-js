import {TileState} from './types'
export default class Tile {
  private _z:number;
  private _x:number;
  private _y:number;
  private _url:string;
  private _image:HTMLImageElement;
  private _state:number = TileState.NONE;
  constructor(z: number, x: number, y: number, url: string) {
    this._z = z
    this._x = x
    this._y = y
    this._url = url
  }
  load(){
    this._image = new Image(256,256);
    this._image.onerror = () => {
      this._state = TileState.ERROR
    };  
    this._image.onload = () => {
      this._state = TileState.OK
    };
    this._state = TileState.LOADING
    this._image.src = this._url
    return this
  }
  getParentKeys():Array<String>{
    const keys:Array<String> = new Array()
    let x= this._x,y = this._y,z= this._z
    if(z===0) return keys
    for (let index = z-1; index >= 0; index--) {
      y = Math.floor(y/2)
      x = Math.floor(x/2)
      keys.push(`${index}-${x}-${y}`)
    }
    return keys;
  }
  include(z: number, x: number, y: number):Boolean{
    if(z<=this._z) return false
    const char = z-this._z
    const jie = Math.pow(2,char)
    return this._x * jie < x && x < (this._x+1) * jie -1 && this._y * jie < y && y < (this._y+1) * jie -1
  }
  get isLoaded():Boolean{return this._state === TileState.OK}
  get state():TileState {return this._state}
  get zoom():number {return this._z}
  get x():number {return this._x}
  get y():number {return this._y}
  get image():HTMLImageElement {return this._image}
}