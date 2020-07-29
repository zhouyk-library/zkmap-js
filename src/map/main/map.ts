import Camera from './camera';
import { Event, EventHandlerManager } from '../events/types';
import { MapOptions } from './types';
import { Sources,SourceOption } from '../source/types';
import { Layers,LayerOption } from '../layer/types';
import { Cancelable } from '../utils/types';
import { Transform } from '../geo/types';
import { Render } from '../render/types';
import { TaskQueue,TaskID } from '../queue/types';
import { URL } from '../com/types';
import Utils from '../utils'

class Map extends Camera {
  private _container: HTMLElement;
  private _canvas: HTMLCanvasElement;
  private _sources:Sources;
  private _layers:Layers;
  _render: Render;
  private _frame: Cancelable;
  private _options: MapOptions;
  private _url: URL;
  private _renderTaskQueue: TaskQueue;
  private _canvasContainer: HTMLElement;
  private _eventHandlerManager: EventHandlerManager;
  constructor(options?: MapOptions) {
    if (options.minZoom != null && options.maxZoom != null && options.minZoom > options.maxZoom) {
      throw new Error(`maxZoom must be greater than or equal to minZoom`);
    }
    if (!(Number.isInteger(options.minZoom) && Number.isInteger(options.maxZoom))) {
      options.minZoom = 0
      options.maxZoom = 22
    }
    var container = null
    if (typeof options.container === 'string') {
      container = window.document.getElementById(options.container) as HTMLDivElement;
      if (!container) {
        throw new Error(`Container '${options.container}' not found.`);
      }
    } else if (options.container instanceof HTMLElement) {
      container = options.container;
    } else {
      throw new Error(`Invalid type: 'container' must be a String or HTMLElement.`);
    }
    const canvasContainer: HTMLElement = Utils.DOM.create('div', undefined, 'touch-action: none;cursor: grab;user-select: none;', container)
    const canvas: HTMLCanvasElement = <HTMLCanvasElement>Utils.DOM.create('canvas', undefined, "position: absolute;left: 0;top: 0;", canvasContainer);
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    container.appendChild(canvasContainer);
    const transform = new Transform(canvas, options.minZoom, options.maxZoom, options.type);
    super(transform);
    this._url = new URL('','')
    this._sources = new Sources()
    this._layers = new Layers(this._sources)
    const render = new Render(this);
    this._options = options;
    this._renderTaskQueue = new TaskQueue();
    this._canvas = canvas;
    this._container = container
    this._canvasContainer = canvasContainer
    this._eventHandlerManager = new EventHandlerManager(this)
    this.resize();
    this._render = render;
    this.triggerRepaint()
    this.on('refresh', this.triggerRepaint)
    this._render.computed();
  }
  getUrl(z: number, x: number, y: number): string{
    return this._url.getUrl(z,x,y)
  }
  getCanvasContainer(): HTMLElement {
    return this._canvasContainer
  }
  resize(eventData?: Object) {
    this.transform.resize(this._container.clientWidth, this._container.clientHeight)
  }
  addSource(sourceOption:SourceOption):String {
    return sourceOption.id
  }
  removeSource(sourceId:String){

  }
  addLayer(layerOption:LayerOption,layerId?:String):String {
    return layerOption.id
  }
  removeLayer(layerId:String){
    
  }
  _requestRenderFrame(callback: (_:any) => void): TaskID {
    // this._update();
    return this._renderTaskQueue.add(callback);
  }
  _update(updateStyle?: boolean) {
    this._frame = Utils.Browser.requestAnimationFrame((paintStartTimeStamp: number) => {
      this._frame = null;
      this._renderTaskQueue.run()
      this._render.render();
      return this
    });
  }
  triggerRepaint() {
    this._frame = Utils.Browser.requestAnimationFrame((paintStartTimeStamp: number) => {
      this._frame = null;
      this._renderTaskQueue.run()
      this._render.render();
      this.triggerRepaint()
      return this
    });
  }
}

export default Map