import { Cancelable } from './types';
export function extend(dest: Object, ...sources: Array<Object>): Object {
  for (const src of sources) {
    for (const k in src) {
      dest[k] = src[k];
    }
  }
  return dest;
}

export function bindAll(fns: Array<string>, context: Object): void {
  fns.forEach((fn) => {
    if (!context[fn]) { return; }
    context[fn] = context[fn].bind(context);
  });
}

// @ts-ignore
const raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

// @ts-ignore
const cancel = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame;

export function bindRAFrame(fn: (paintStartTimestamp: number) => void): Cancelable {
  const frame = raf(fn);
  return { cancel: () => cancel(frame) };
}