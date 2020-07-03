import Camera from './camera';
import { Event, EventHandlerManager } from '../events/types';
import { MapOptions } from './types';
import { Cancelable } from '../utils/types';
import { Transform } from '../geo/types';
import { Render } from '../render/types';
import { TaskQueue,TaskID } from '../queue/types';
import Utils from '../utils'

class Map extends Camera {
  private _container: HTMLElement;
  private _canvas: HTMLCanvasElement;
  _render: Render;
  private _frame: Cancelable;
  private _options: MapOptions;
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
    const render = new Render(this);
    this._options = options;
    this._renderTaskQueue = new TaskQueue();
    this._canvas = canvas;
    this._container = container
    this._canvasContainer = canvasContainer
    this._eventHandlerManager = new EventHandlerManager(this)
    this._bind()
    this.resize();
    this._render = render;
    this.triggerRepaint()
    this.on('refresh', this.triggerRepaint)
    this._render.computed();
  }
  getCanvasContainer(): HTMLElement {
    return this._canvasContainer
  }
  resize(eventData?: Object) {
    this.transform.resize(this._container.clientWidth, this._container.clientHeight)
  }
  
  _requestRenderFrame(callback: (_:any) => void): TaskID {
    this._update();
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
  _bind() {
    this._canvas.addEventListener("click", this._onClick.bind(this));
    this._canvas.addEventListener("dblclick", this._onDoubleClick.bind(this));
    this._canvas.addEventListener("mousedown", this._onMouseDown.bind(this));
    this._canvas.addEventListener("mousemove", this._onMouseMove.bind(this));
    this._canvas.addEventListener("mouseup", this._onMouseUp.bind(this));
    this._canvas.addEventListener("wheel", this._onWheel.bind(this));
  }
  _onClick(event) {
    this.fire(new Event("click", event))
  }

  _onDoubleClick(event) {
    this.fire(new Event("dblclick", event))
  }

  _onMouseDown(event) {
    this.fire(new Event("mousedown", event))
  }

  _onMouseMove(event) {
    this.fire(new Event("mousemove", event))
  }

  _onMouseUp(event) {
    this.fire(new Event("mouseup", event))
  }

  _onWheel(event) {
    this.fire(new Event("wheel", event))
  }

  destroy() {
    this._canvas.removeEventListener("click", this._onClick);
    this._canvas.removeEventListener("dblclick", this._onDoubleClick);
    this._canvas.removeEventListener("mousedown", this._onMouseDown);
    this._canvas.removeEventListener("mousemove", this._onMouseMove);
    this._canvas.removeEventListener("mouseup", this._onMouseUp);
    this._canvas.removeEventListener("wheel", this._onWheel);
  }
  triggerRepaint() {
    // this._frame = Utils.Browser.requestAnimationFrame((paintStartTimeStamp: number) => {
    //   this._frame = null;
    //   this._render.render();
    //   this.triggerRepaint()
    //   return this
    // });
  }
}

export default Map