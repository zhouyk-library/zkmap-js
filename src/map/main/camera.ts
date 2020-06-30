import { LngLat } from '../geo/types';
import { Evented } from '../events/types';
import Transform from '../geo/transform';
import { Render } from '../render/types';
class Camera extends Evented {
  transform: Transform;
  render: Render;
  offsetX: number = 0;
  offsetY: number = 0;
  dragFlag: boolean;
  start: any = {};

  constructor(transform: Transform, render: Render) {
    super();
    this.transform = transform;
    this.render = render;
    this.on('wheel', this.wheelZoomCenter)
    this.on('mouseup', this.mouseupDetail)
    this.on('mousemove', this.mousemoveDetail)
    this.on('mousedown', this.mousedownDetail)
    this.render.computed()
  }
  mouseupDetail(event): void {
    this.dragFlag = false
  }
  mousemoveDetail(event): void {
    if (this.dragFlag) {
      this.transform.moveCenter([event.x - this.start.x,event.y - this.start.y])
      this.render.computed()
      this.start.x = event.x;
      this.start.y = event.y;
    }
  }
  mousedownDetail(event): void {
    this.dragFlag = true
    this.start.x = event.x;
    this.start.y = event.y;
  }
  wheelZoomCenter(event): void {
    const sensitivity = 100;
    const delta = -event.deltaY / sensitivity /5
    if ((this.transform.maxZoom < this.transform.zoom && delta > 0)
      || (this.transform.minZoom > this.transform.zoom && delta < 0)) return;
    this.transform.anchorPoint = [event.x,event.y]
    this.transform.zoom = this.transform.zoom + delta
    this.render.computed()
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
