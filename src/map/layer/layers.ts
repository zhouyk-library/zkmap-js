import {ILayer,LayerOption,RasterLayer} from './types'
import {Sources,ISource} from '../source/types'
export default class Layers{
  private _layers:Map<string,ILayer>;
  private _sources:Sources;
  constructor(sources:Sources) {
    this._layers = new Map<string,ILayer>()
    this._sources = sources
  }
  addCreatLayer(option:LayerOption):ILayer{
    var layer:ILayer = null;
    switch (option.type) {
      case "raster":
        layer = new RasterLayer(option);
        break;
      default:
        break;
    }
    if(this._layers.has(layer.id)){
      console.warn("same of layer id,will over old!");
    }
    this._layers.set(layer.id,layer)
    return layer;
  }
  forEach(fn:(value: ILayer, key: String, map: Map<String, ILayer>)=>void):Layers{
    this._layers.forEach((value: ILayer, key: String, map: Map<String, ILayer>)=>{fn(value,key,map);} )
    return this;
  }
  remove(id:string):Layers{
    this._layers.delete(id)
    return this;
  }
  render(): void{
    this._layers.forEach((layer: ILayer, key: string, map: Map<String, ILayer>)=>{
      const sourceId:string = layer.getSourceId()
      if(!this._sources.hasSource(sourceId)){
        return ;
      }
      const source:ISource = this._sources.getSource(sourceId)
      layer.render(source)
    } )
  }
}