import {LngLat} from '../geo/types';
import {Evented} from './events';
import Transform from '../geo/transform';
import {Render} from '../render/types';
class Camera extends Evented {
  transform: Transform;
  render: Render;
  offsetX:number = 0;
  offsetY:number = 0;
  dragFlag:boolean;
  start: any = {};
  
  constructor(transform: Transform,render: Render) {
    super();
    this.transform = transform;
    this.render = render;
    this.on('wheel',this.wheelZoomCenter)
    this.on('mouseup',this.mouseupDetail)
    this.on('mousemove',this.mousemoveDetail)
    this.on('mousedown',this.mousedownDetail)
  }
  mouseupDetail(event):void{
    this.dragFlag = false
  }
  mousemoveDetail(event):void{
    if (this.dragFlag) {
      this.matrixRender({mov:{
        dx:event.x - this.start.x,
        dy:event.y - this.start.y
      }})
      this.start.x = event.x;
      this.start.y = event.y;
    }
  }
  mousedownDetail(event):void{
    this.dragFlag = true
    this.start.x = event.x;
    this.start.y = event.y;
  }
  wheelZoomCenter(event):void {
    const sensitivity = 100;
    const delta = -event.deltaY / sensitivity > 0 ? 1:-1;
    if((this.transform.maxZoom == this.transform.zoom && delta > 0) 
      || (this.transform.minZoom == this.transform.zoom && delta < 0) ) return;
    this.transform.zoom = this.transform.zoom + delta
    const size = Math.pow(2, delta);
    this.matrixRender({scale:{
      scale:size,
      x:event.x,
      y:event.y
    }})
  }
  matrixRender(option:any):void{
    this.transform.matrix(option)
    this.render.render()
    this.render.drawLngLatLine()
  }
  getCenter(): LngLat { return new LngLat(this.transform.center.lng, this.transform.center.lat); }
  setCenter(center: LngLat, eventData?: Object) {
  }
  getZoom(): number { return this.transform.zoom; }

  setZoom(zoom: number, eventData?: Object) {
    return this;
  }
  
}

export default Camera;
