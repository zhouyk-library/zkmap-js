import { TileState, Tile } from '../types'
const transparentPngUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQYV2NgAAIAAAUAAarVyFEAAAAASUVORK5CYII=';
import Utils from '../../utils'
export default class RasterTile implements Tile{
  private _time: number;
  private _z: number;
  private _x: number;
  private _y: number;
  private _url: string;
  private _controller: AbortController;
  private _image: HTMLImageElement | ImageBitmap;
  private _state: number = TileState.NONE;
  private _done: (_: RasterTile) => void;
  constructor(z: number, x: number, y: number, url: string) {
    this._z = z
    this._x = x
    this._y = y
    this._url = url
  }
  arrayBufferToImageBitmap(data: ArrayBuffer) {
    const blob: Blob = new window.Blob([new Uint8Array(data)], { type: 'image/png' });
    window.createImageBitmap(blob).then((imgBitmap) => {
      this._time = Utils.Browser.now()
      this._image = imgBitmap
      this._done && this._done(this)
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
      this._time = Utils.Browser.now()
      this._done && this._done(this)
      this._state = TileState.OK
      URL.revokeObjectURL(image.src);
    };
    const blob: Blob = new window.Blob([new Uint8Array(data)], { type: 'image/png' });
    this._image.src = data.byteLength ? URL.createObjectURL(blob) : transparentPngUrl;

  }
  load():RasterTile {
    this._controller = new window.AbortController()
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
    }).catch(error => {
      this._state = TileState.ERROR
      console.log(error)
    });
    return this
  }
  then(done: (_: RasterTile) => void):RasterTile {
    this._done = done
    this.isLoaded && this._done(this)
    return this
  }
  destroy():RasterTile {
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
  get isLoaded(): Boolean { return this._state === TileState.OK }
  get isFinish(): Boolean { return this._state === TileState.OK || this._state === TileState.ERROR }
  get state(): TileState { return this._state }
  get z(): number { return this._z }
  get x(): number { return this._x }
  get y(): number { return this._y }
  get image(): HTMLImageElement | ImageBitmap { return this._image }
  get time():number { return this._time }
  get xyz():string { return this._z+'-'+this._x+'-'+this._y}
  get id():string { return this._url}
}