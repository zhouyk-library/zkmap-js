export function create(tagName: string, className?: string, cssText?: string, container?: HTMLElement) {
  const el = window.document.createElement(tagName);
  if (className !== undefined) el.className = className;
  if (cssText !== undefined) el.style.cssText = cssText;
  if (container) container.appendChild(el);
  return el
}

export function addEventListener(target: any, type: any, callback: any, options: { passive?: boolean, capture?: boolean } = {}) {
  if ('passive' in options) {
    target.addEventListener(type, callback, options);
  } else {
    target.addEventListener(type, callback, options.capture);
  }
}

export function removeEventListener(target: any, type: any, callback: any, options: { passive?: boolean, capture?: boolean } = {}) {
  if ('passive' in options) {
    target.removeEventListener(type, callback, options);
  } else {
    target.removeEventListener(type, callback, options.capture);
  }
}