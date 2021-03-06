import { Task, TaskID } from './types'
export default class TaskQueue {
  private _queue: Array<Task>;
  private _id: TaskID;
  private _cleared: boolean;
  private _currentlyRunning: Array<Task> | false;
  
  constructor()  {
    this._queue = [];
    this._id = 0;
    this._cleared = false;
    this._currentlyRunning = false;
  }
  
  add(callback: (timeStamp: number) => void): TaskID {
    const id = ++this._id;
    const queue = this._queue;
    queue.push({callback, id, cancelled: false});
    return id;
  }

  remove(id: TaskID) {
    const running = this._currentlyRunning;
    const queue = running ? this._queue.concat(running) : this._queue;
    for (const task of queue) {
        if (task.id === id) {
            task.cancelled = true;
            return;
        }
    }
  }

  run(timeStamp: number = 0) {
    const queue = this._currentlyRunning = this._queue;
    this._queue = [];
    for (const task of queue) {
        if (task.cancelled) continue;
        task.callback(timeStamp);
        if (this._cleared) break;
    }
    this._cleared = false;
    this._currentlyRunning = false;
  }

  clear() {
    if (this._currentlyRunning) {
        this._cleared = true;
    }
    this._queue = [];
  }
}