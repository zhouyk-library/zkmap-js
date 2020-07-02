export type TaskID = number;
export type Task = {
  callback: (timeStamp: number) => void;
  id: TaskID;
  cancelled: boolean;
};
import TaskQueue from './task_queue'

export{
  TaskQueue
}