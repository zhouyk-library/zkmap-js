import Camera from './camera';
import {MapOptions,Event} from './types';
import {Transform} from '../geo/types';
import {Render} from '../render/types';

class Map extends Camera {
  private _container: HTMLElement;
  private _canvas: HTMLCanvasElement;
  private _render: Render;
  private _options: MapOptions;
  constructor(options?: MapOptions) {
      if (options.minZoom != null && options.maxZoom != null && options.minZoom > options.maxZoom) {
          throw new Error(`maxZoom must be greater than or equal to minZoom`);
      }
      if(!(Number.isInteger(options.minZoom) && Number.isInteger(options.maxZoom))){
        options.minZoom = 0
        options.maxZoom = 22
      }
      const canvas = document.createElement("canvas");
      canvas.style.cssText = "height: 100%; width: 100%";
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
      canvas.width = container.clientWidth ;
      canvas.height = container.clientHeight;
      container.appendChild(canvas);
      const transform = new Transform(canvas,options.minZoom, options.maxZoom, options.type);
      const render = new Render(transform);
      super(transform,render);
      this._options = options;
      this._canvas = canvas;
      this._container = container
      this._bind()
      this.resize();
      this._render = render;
      this._render.render()
  }
  
  resize(eventData?: Object) {
    this.transform.resize(this._container.clientWidth,this._container.clientHeight)
  }
  
  _update(updateStyle?: boolean) {
  }
  _bind(){
    this._canvas.addEventListener("click", this._onClick.bind(this));
    this._canvas.addEventListener("dblclick", this._onDoubleClick.bind(this));
    this._canvas.addEventListener("mousedown", this._onMouseDown.bind(this));
    this._canvas.addEventListener("mousemove", this._onMouseMove.bind(this));
    this._canvas.addEventListener("mouseup", this._onMouseUp.bind(this));
    this._canvas.addEventListener("wheel", this._onWheel.bind(this));
  }
  _onClick(event) {
    this.fire(new Event("click",event))
  }

  _onDoubleClick(event) {
    this.fire(new Event("dblclick",event))
  }

  _onMouseDown(event) {
    this.fire(new Event("mousedown",event))
  }

  _onMouseMove(event) {
    this.fire(new Event("mousemove",event))
  }

  _onMouseUp(event) {
    this.fire(new Event("mouseup",event))
  }

  _onWheel(event) {
    this.fire(new Event("wheel",event))
  }

  destroy() {
      this._canvas.removeEventListener("click", this._onClick);
      this._canvas.removeEventListener("dblclick", this._onDoubleClick);
      this._canvas.removeEventListener("mousedown", this._onMouseDown);
      this._canvas.removeEventListener("mousemove", this._onMouseMove);
      this._canvas.removeEventListener("mouseup", this._onMouseUp);
      this._canvas.removeEventListener("wheel", this._onWheel);
  }
}

export default Map