import { ISource, SourceResult, SourceOption } from './types'
import { Transform, Bound } from '../geo/types';
export default class PointSource implements ISource {
  private _id: String;
  constructor(option: SourceOption) {
    this._id = option.id
  }
  get id(): String {
    return this._id;
  }
  refresh(): void { }
  getData(transform: Transform, bound: Bound): SourceResult {
    return {}
  }
}