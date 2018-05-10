const debuglog = require('util').debuglog('lock')
const expect = require('chai').expect
const Lock = require('./lock')

function AsyncStore() {
  let value = 0
  return {
    get: function (time) {
      return new Promise(function(resolve, reject) {
        setTimeout(function() {
          resolve(value)
        }, time)
      })
    },

    put: function (newValue, time) {
      return new Promise(function(resolve, reject) {
        setTimeout(function() {
          value = newValue
          resolve()
        }, time)
      })
    }
  }
}

let store = AsyncStore()

async function incr(delay) {
  let value = await store.get(0)
  return store.put(value + 1, delay)
}

let lock = new Lock()

async function incrLock(delay) {
  await lock.acquire()
  debuglog('acquired in action')
  await incr(delay)
  lock.release()
  debuglog('after release')
}

describe('lock', () => {

  beforeEach(async () => {
    await store.put(0, 0)
  })

  it('should overwrite in concurrent when no lock', async () => {
    await Promise.all([
      incr(10),
      incr(0)
    ])
    let result = await store.get(0)
    expect(result).to.be.equal(1)
  })

  it('should serial when lock', async () => {
    await Promise.all([
      incrLock(10),
      incrLock(0)
    ])
    let result = await store.get(0)
    expect(result).to.be.equal(2)
  })

  it('should handle 3 when lock', async () => {
    await Promise.all([
      incrLock(10),
      incrLock(20),
      incrLock(0)
    ])
    let result = await store.get(0)
    expect(result).to.be.equal(3)
  })

  it('should throw expect when release a not acquire lock', async () => {
    let ok = false
    try {
      lock.release()
    } catch (err) {
      expect(err).to.be.an('error')
      ok = true
    }
    expect(ok).to.be.true
  })

})
