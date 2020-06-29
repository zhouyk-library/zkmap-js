import {Event,ErrorLike} from './types'
import Utils from '../utils';
export default class ErrorEvent extends Event {
  error: ErrorLike;
  constructor(error: ErrorLike, data: Object = {}) {
      super('error', Utils.Objects.extend({error}, data));
  }
}