import Utils from '../utils';
export default class Event {
  _type?: string;
  _target?: any;
  constructor(type: string, data: any = {}) {
    Utils.Objects.extend(this, data);
    this._type = type;
  }
  get type(): string{ return  this._type; }
  set type(type: string){ this._type = type;}
  get target(): any{ return  this._target;}
  set target(target: any){ this._target = target;}
}