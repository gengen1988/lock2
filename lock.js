module.exports = class Lock {

  acquire() {
    return new Promise(resolve => {
      if (!this.resolvers) {
        this.resolvers = []
        resolve()
        return
      }
      this.resolvers = [ ...this.resolvers, resolve ]
    })
  }

  release() {
    let resolve = this.resolvers[0]
    if (!resolve) {
      this.resolvers = undefined
      return
    }
    this.resolvers = this.resolvers.slice(1)
    resolve()
  }

}
