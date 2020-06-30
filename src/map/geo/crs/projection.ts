import {Bound} from '../types'
export default interface Projection {
  project([lng, lat]: number[]): number[] ;
  unproject([x, y]: number[]): number[];
  bound:Bound;
}

