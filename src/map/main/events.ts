import {extend} from './util';
import {Listeners,Listener,ErrorLike} from './types'


function _addEventListener(type: string, listener: Listener, listenerList: Listeners) {
  const listenerExists = listenerList[type] && listenerList[type].indexOf(listener) !== -1;
  if (!listenerExists) {
      listenerList[type] = listenerList[type] || [];
      listenerList[type].push(listener);
  }
}

function _removeEventListener(type: string, listener: Listener, listenerList: Listeners) {
  if (listenerList && listenerList[type]) {
      const index = listenerList[type].indexOf(listener);
      if (index !== -1) {
          listenerList[type].splice(index, 1);
      }
  }
}


export class Event {
  type?: string;
  target?: any;
  constructor(type: string, data: any = {}) {
      extend(this, data);
      this.type = type;
  }
}

export class ErrorEvent extends Event {
  error: ErrorLike;
  constructor(error: ErrorLike, data: Object = {}) {
      super('error', extend({error}, data));
  }
}

export class Evented {
  _listeners: Listeners;
  _oneTimeListeners: Listeners;
  _eventedParent?: Evented;
  _eventedParentData?: Object;
  on(type: string, listener: Listener): this {
      this._listeners = this._listeners || {};
      _addEventListener(type, listener, this._listeners);
      return this;
  }

  off(type: string, listener: Listener) {
      _removeEventListener(type, listener, this._listeners);
      _removeEventListener(type, listener, this._oneTimeListeners);
      return this;
  }

  once(type: string, listener: Listener) {
      this._oneTimeListeners = this._oneTimeListeners || {};
      _addEventListener(type, listener, this._oneTimeListeners);
      return this;
  }

  fire(event: Event, properties?: Object) {
      if (typeof event === 'string') {
          event = new Event(event, properties || {});
      }
      const type = event.type;
      if (this.listens(type)) {
          event.target = this;
          const listeners = this._listeners && this._listeners[type] ? this._listeners[type].slice() : [];
          for (const listener of listeners) {
              listener.call(this, event);
          }

          const oneTimeListeners = this._oneTimeListeners && this._oneTimeListeners[type] ? this._oneTimeListeners[type].slice() : [];
          for (const listener of oneTimeListeners) {
              _removeEventListener(type, listener, this._oneTimeListeners);
              listener.call(this, event);
          }

          const parent = this._eventedParent;
          if (parent) {
              extend(
                  event,
                  typeof this._eventedParentData === 'function' ? this._eventedParentData() : this._eventedParentData
              );
              parent.fire(event);
          }
      } else if (event instanceof ErrorEvent) {
          console.error(event.error);
      }

      return this;
  }

  listens(type: string) {
      return (
          (this._listeners && this._listeners[type] && this._listeners[type].length > 0) ||
          (this._oneTimeListeners && this._oneTimeListeners[type] && this._oneTimeListeners[type].length > 0) ||
          (this._eventedParent && this._eventedParent.listens(type))
      );
  }

  setEventedParent(parent?: Evented, data?: Object) {
      this._eventedParent = parent;
      this._eventedParentData = data;
      return this;
  }
}
