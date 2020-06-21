
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