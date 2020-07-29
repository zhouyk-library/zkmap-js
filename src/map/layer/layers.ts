import {ILayer,LayerOption,RasterLayer} from './types'
export default class Layers{
  constructor() {
  }
  addCreatLayer(option:LayerOption):ILayer{
    var source:ILayer = null;
    switch (option.type) {
      case "raster":
        source = new RasterLayer("");
        break;
      default:
        break;
    }
    return source;
  }
}