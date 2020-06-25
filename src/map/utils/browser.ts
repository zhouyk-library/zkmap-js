
// @ts-ignore
const raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

// @ts-ignore
const cancel = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame;

/**
 * 动画帧回调
 * @param fn requestAnimationFrame 回调
 * @returns cancelAnimationFrame
 */
export function requestAnimationFrame(fn: (paintStartTimestamp: number) => void): { cancel: () => void } {
  const frame = raf(fn);
  return { cancel: () => cancel(frame) };
}