export default class Context{
  private _context?:CanvasRenderingContext2D | WebGLRenderingContext
  private isgl:boolean;
  constructor(context:CanvasRenderingContext2D | WebGLRenderingContext){
    this._context = context
    if(context instanceof CanvasRenderingContext2D){
      this.isgl = false
    }else{
      this.isgl = true
    }
  }
  get ctx():CanvasRenderingContext2D{
    return <CanvasRenderingContext2D>this._context;
  }
  get gl():WebGLRenderingContext{
    return <WebGLRenderingContext>this._context;
  }
  get isGl():boolean{
    return this.isgl;
  }
  get isCtx():boolean{
    return !this.isgl;
  }
}