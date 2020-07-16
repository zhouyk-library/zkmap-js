import Utils from './index'

export function createCanvas(width:number, height:number, canvasClass?:any) :HTMLCanvasElement {
  let canvas;
  if (!canvasClass) {
      canvas = Utils.DOM.create('canvas');
      canvas.width = width;
      canvas.height = height;
  } else {
      canvas = new canvasClass(width, height);
  }
  return canvas;
}

export function image(ctx:CanvasRenderingContext2D, img:CanvasImageSource, x:number, y:number, width:number, height:number) {
  try {
      if (Utils.Number.isNumber(width) && Utils.Number.isNumber(height)) {
          ctx.drawImage(img, x, y, width, height);
      } else {
          ctx.drawImage(img, x, y);
      }
  } catch (error) {
      if (console) {
          console.warn('error when drawing image on canvas:', error);
          console.warn(img);
      }
  }
}