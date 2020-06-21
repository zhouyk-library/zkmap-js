import {Bound} from '../types'
export default interface Projection {
  project([lng, lat]): number[] ;
  unproject([x, y]): number[];
  bound:Bound;
}

