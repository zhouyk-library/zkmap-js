
import RasterLayer from './raster_Layer';
import Layers from './layers';
export {RasterLayer,Layers}
export interface ILayer {
  id: String;
  enable(): void;
  disable(): void;
  render(): void;
  getImage(): HTMLCanvasElement;
  getSourceId():String;
  setSourceId(sourceId :String): void;
}
export type LayerOption = {
  id:String;
  type:String;
  source:String;
}