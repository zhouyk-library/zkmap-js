import { TileState, Tile } from '../types'
const transparentPngUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQYV2NgAAIAAAUAAarVyFEAAAAASUVORK5CYII=';
import Utils from '../../utils'
export default class RasterTile implements Tile {
  private _time: number;
  private _z: number;
  private _x: number;
  private _y: number;
  private _url: string;
  private _controller: AbortController;
  private _image: CanvasImageSource;
  private _state: number = TileState.NONE;
  private _done: (_: RasterTile) => void;
  private _error: (_: RasterTile) => void;
  private _dx: number = 0;
  private _dy: number = 0;
  private _dw: number = 256;
  private _dh: number = 256;

  constructor(z: number, x: number, y: number, url: string) {
    this._z = z
    this._x = x
    this._y = y
    this._url = url
  }
  transfroms(dx: number, dy: number, dw: number, dh: number) {
    this._dx = dx
    this._dy = dy
    this._dw = dw
    this._dh = dh
  }
  arrayBufferToImageBitmap(data: ArrayBuffer) {
    const blob: Blob = new window.Blob([new Uint8Array(data)], { type: 'image/png' });
    window.createImageBitmap(blob).then((imgBitmap) => {
      this._time = Utils.Browser.now()
      this._image = imgBitmap
      this._done && this._done(this)
      this._state = TileState.OK
    }).catch(error => {
      this._state = TileState.ERROR
      this._error && this._error(this)
    }
    );
  }
  arrayBufferToImage(data: ArrayBuffer) {
    const URL = window.URL;
    const image = new window.Image();
    this._image = image
    this._image.onerror = () => {
      this._state = TileState.ERROR
      this._error && this._error(this)
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
  load(): RasterTile {
    this._controller = new window.AbortController()
    const myHeaders = new Headers();
    myHeaders.append("Connection", "keep-alive");
    myHeaders.append("Accept", "*/*");
    myHeaders.append("Accept-Language", "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6");
    const request = new window.Request(this._url, {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
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
      this._error && this._error(this)
    });
    return this
  }
  then(done: (_: RasterTile) => void): RasterTile {
    this._done = done
    this.isLoaded && this._done(this)
    return this
  }
  error(error: (_: RasterTile) => void): RasterTile {
    this._error = error
    this._state === TileState.ERROR && this._error(this)
    return this
  }
  destroy(): RasterTile {
    this._controller.abort();
    delete this._z
    delete this._x
    delete this._y
    delete this._done
    delete this._error
    delete this._dx
    delete this._dy
    delete this._dw
    delete this._dh
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
  get image(): CanvasImageSource { return this._image }
  get time(): number { return this._time }
  get xyz(): string { return this._z + '-' + this._x + '-' + this._y }
  get id(): string { return this._url }
  get dx(): number { return this._dx };
  get dy(): number { return this._dy };
  get dw(): number { return this._dw };
  get dh(): number { return this._dh }
}