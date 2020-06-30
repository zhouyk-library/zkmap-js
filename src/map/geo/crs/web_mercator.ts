import {Projection,Bound} from '../types'
export default class WebMercator implements Projection{
  static R: number = 6378137;
  get bound():Bound {
      return new Bound(- Math.PI * WebMercator.R, Math.PI * WebMercator.R, Math.PI * WebMercator.R, -Math.PI * WebMercator.R);
  }
  project([lng, lat]:Array<number>): number[] {
      const d = Math.PI / 180, sin = Math.sin(lat * d);
      return [WebMercator.R * lng * d,  WebMercator.R * Math.log((1 + sin) / (1 - sin)) / 2];
  }
  unproject([x, y]: number[]): number[] {
      const d = 180 / Math.PI;
      return  [x * d / WebMercator.R, (2 * Math.atan(Math.exp(y / WebMercator.R)) - (Math.PI / 2)) * d];
  }
}