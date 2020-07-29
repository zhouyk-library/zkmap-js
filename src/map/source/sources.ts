import {ISource,SourceOption,RasterSource} from './types'
export default class Sources{
  constructor() {
  }
  addCreatSource(option:SourceOption):ISource{
    var source:ISource = null;
    switch (option.type) {
      case "raster":
        source = new RasterSource("");
        break;
      default:
        break;
    }
    return source;
  }
}