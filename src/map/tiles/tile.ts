import { TileState } from './types'
const transparentPngUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQYV2NgAAIAAAUAAarVyFEAAAAASUVORK5CYII=';
import Utils from '../utils'
export default class Tile {
  private _z: number;
  private _x: number;
  private _y: number;
  private _url: string;
  private _controller: AbortController;
  private _image: HTMLImageElement | ImageBitmap;
  private _state: number = TileState.NONE;
  constructor(z: number, x: number, y: number, url: string) {
    this._z = z
    this._x = x
    this._y = y
    this._url = url
    this._controller = new window.AbortController()
  }
  arrayBufferToImageBitmap(data: ArrayBuffer) {
    const blob: Blob = new window.Blob([new Uint8Array(data)], { type: 'image/png' });
    window.createImageBitmap(blob).then((imgBitmap) => {
      this._image = imgBitmap
      this._state = TileState.OK
    }).catch(error =>
      this._state = TileState.ERROR
    );
  }
  arrayBufferToImage(data: ArrayBuffer) {
    const URL = window.URL;
    const image = new window.Image();
    this._image = image
    this._image.onerror = () => {
      this._state = TileState.ERROR
    };
    this._image.onload = () => {
      this._state = TileState.OK
      URL.revokeObjectURL(image.src);
    };
    const blob: Blob = new window.Blob([new Uint8Array(data)], { type: 'image/png' });
    this._image.src = data.byteLength ? URL.createObjectURL(blob) : transparentPngUrl;

  }
  load() {
    const request = new window.Request(this._url, {
      method: 'GET',
      mode: 'cors',
      signal: this._controller.signal
    });
    fetch(this._url, request).then(response => {
      if (response.ok) {
        response.arrayBuffer().then(data => {
          if (Utils.Browser.offscreenCanvasSupported()) {
            this.arrayBufferToImageBitmap(data);
          } else {
            this.arrayBufferToImage(data);
          }
        })
      }
    }).catch(error => console.log(error));
    return this
  }
  destroy() {
    this._controller.abort();
    delete this._z
    delete this._x
    delete this._y
    delete this._url
    delete this._controller
    delete this._image
    delete this._state
    return this
  }
  getParentKeys(): Array<String> {
    const keys: Array<String> = new Array()
    let x = this._x, y = this._y, z = this._z
    if (z === 0) return keys
    for (let index = z - 1; index >= 0; index--) {
      y = Math.floor(y / 2)
      x = Math.floor(x / 2)
      keys.push(`${index}-${x}-${y}`)
    }
    return keys;
  }
  getChildrenKeys(): Array<String> {
    const keys: Array<String> = new Array()
    let x = this._x, y = this._y, z = this._z + 1
    if (z === 0) return keys
    for (let index = 0; index <= 1; index++) {
      y = y + index
      x = x + index
      keys.push(`${index}-${x}-${y}`)
    }
    return keys;
  }
  include(z: number, x: number, y: number): Boolean {
    if (z <= this._z) return false
    const char = z - this._z
    const jie = Math.pow(2, char)
    return this._x * jie < x && x < (this._x + 1) * jie - 1 && this._y * jie < y && y < (this._y + 1) * jie - 1
  }
  get isLoaded(): Boolean { return this._state === TileState.OK }
  get isFinish(): Boolean { return this._state === TileState.OK || this._state === TileState.ERROR }
  get state(): TileState { return this._state }
  get zoom(): number { return this._z }
  get x(): number { return this._x }
  get y(): number { return this._y }
  get image(): HTMLImageElement | ImageBitmap { return this._image }
}