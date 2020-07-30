import {ILayer,LayerOption,RasterLayer,RasterDebuggerLayer} from './types'
import { Transform } from '../geo/types';
import {Sources,ISource} from '../source/types'
import { Map as Zkmap } from '../main/types';
export default class Layers{
  private _map: Zkmap;
  private _transform: Transform;
  private _layers:Map<string,ILayer>;
  private _order:Array<string>;
  private _sources:Sources;
  constructor(sources:Sources, map: Zkmap) {
    this._map = map;
    this._transform = this._map.transform
    this._layers = new Map<string,ILayer>()
    this._order = new Array<string>()
    this._sources = sources
  }
  addCreatLayer(option:LayerOption,layerId?:string):ILayer{
    var layer:ILayer = null;
    switch (option.type) {
      case "raster":
          layer = new RasterLayer(option,this._transform);
        break;
        case "rasterdebugger":
          layer = new RasterDebuggerLayer(option,this._transform);
          break;
      default:
        break;
    }
    if(this._layers.has(layer.id)){
      console.warn("same of layer id,will over old!");
      this.remove(layer.id);
    }
    this._layers.set(layer.id,layer)
    const layerIndex = this._order.indexOf(layerId)
    if(layerIndex> -1){
      this._order.splice(layerIndex,0,layerId)
    }else{
      this._order.push(layer.id)
    }
    return layer;
  }
  forEach(fn:(layer: ILayer, key: String)=>void):Layers{
    this._order.forEach((key: string)=>{
      const layer: ILayer = this._layers.get(key)
      fn(layer,key);
    } )
    return this;
  }
  remove(id:string):Layers{
    this._layers.delete(id)
    this._order.splice(this._order.indexOf(id), 1);
    return this;
  }
  render(): void{
    this.forEach((layer: ILayer, key: String)=>{
      const sourceId:string = layer.getSourceId()
      if(!(this._sources.hasSource(sourceId) || 'debugger' == sourceId)){
        return ;
      }
      const source:ISource = this._sources.getSource(sourceId)
      layer.render(source)
      layer.draw()
    })
  }
}