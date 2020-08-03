import Camera from './camera';
import { Event, EventHandlerManager } from '../events/types';
import { MapOptions } from './types';
import { Sources,SourceOption } from '../source/types';
import { Layers,ILayer,LayerOption } from '../layer/types';
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
  private _animationFrame: Cancelable;
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
    if(!options.source || options.source.length === 0){
      throw new Error('[ERROR]:source is empty');
    }
    if(!options.layer || options.layer.length === 0){
      throw new Error('[ERROR]:layer is empty');
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
    this._layers = new Layers(this._sources,this)
    options.source.forEach(item=>{
      this.addSource(item)
    })
    options.layer.forEach(item=>{
      this.addLayer(item)
    })
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
    this._sources.addCreatSource(sourceOption)
    return sourceOption.id
  }
  removeSource(sourceId:string){
    this._sources.remove(sourceId)
  }
  addLayer(layerOption:LayerOption,layerId?:string):String {
    this._layers.addCreatLayer(layerOption,layerId)
    return layerOption.id
  }
  removeLayer(layerId:string){
    this._layers.remove(layerId)
  }
  _requestRenderFrame(callback: (_:any) => void): TaskID {
    return this._renderTaskQueue.add(callback);
  }
  triggerRepaint() {
    this._animationFrame && this._animationFrame.cancel && this._animationFrame.cancel()
    this._animationFrame = Utils.Browser.requestAnimationFrame((paintStartTimeStamp: number) => {
      this._animationFrame = null;
      this._renderTaskQueue.run()
      this._layers.render()
      this.triggerRepaint()
      return this
    });
  }
}

export default Map