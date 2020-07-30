import { LngLat } from '../geo/types';
import { Evented } from '../events/types';
import Transform from '../geo/transform';
import { Render } from '../render/types';
class Camera extends Evented {
  transform: Transform;
  _render: Render;

  constructor(transform: Transform) {
    super();
    this.transform = transform;
  }
  getCenter(): LngLat { return this.transform.center; }
  setCenter(center: LngLat) { this.transform.center = center}
  getZoom(): number { return this.transform.zoom; }
  setZoom(zoom: number) { this.transform.zoom = zoom}
}

export default Camera;
