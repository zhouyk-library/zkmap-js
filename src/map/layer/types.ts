
import RasterLayer from './raster_Layer';
import PointLayer from './point_Layer';
import RasterDebuggerLayer from './raster_debugger_layer';
import Layers from './layers';
import { ISource } from '../source/types'
import { Paint } from '../render/types'
export { RasterLayer, Layers, RasterDebuggerLayer, PointLayer }
export interface ILayer {
  id: string;
  enable(): void;
  disable(): void;
  render(source: ISource): void;
  getSourceId(): string;
  draw(): void
  setSourceId(sourceId: string): void;
}
export type LayerOption = {
  id: string;
  type: string;
  source: string;
  paint?: Paint
}