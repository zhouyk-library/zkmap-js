import {ISource,SourceOption,RasterSource} from './types'
export default class Sources{
  private _sources:Map<String,ISource>;
  constructor() {
    this._sources = new Map<String,ISource>()
  }
  addCreatSource(option:SourceOption):ISource{
    var source:ISource = null;
    switch (option.type) {
      case "raster":
        source = new RasterSource(option);
        break;
      default:
        break;
    }
    if(this._sources.has(source.id)){
      console.warn("same of source id,will over old!");
    }
    this._sources.set(source.id,source)
    return source;
  }
  hasSource(id:string):boolean{
    return this._sources.has(id)
  }
  getSource(id:string):ISource{
    return this._sources.get(id)
  }
  remove(id:string):Sources{
    this._sources.delete(id)
    return this;
  }
}