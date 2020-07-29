
import RasterLayer from './raster_Layer';
import Layers from './layers';
import {ISource} from '../source/types'
export {RasterLayer,Layers}
export interface ILayer {
  id: string;
  enable(): void;
  disable(): void;
  render(source:ISource): void;
  getImage(): HTMLCanvasElement;
  getSourceId():string;
  setSourceId(sourceId :string): void;
}
export type LayerOption = {
  id:string;
  type:string;
  source:string;
}