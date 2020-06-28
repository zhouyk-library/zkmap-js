module.exports = class BuildDonePlugin {
  constructor(callback){
    this.callback = callback
  }
  apply(compiler){
    compiler.hooks.done.tap('BuildDonePlugin', status => {
      this.callback && this.callback(status)
    })
  }
}