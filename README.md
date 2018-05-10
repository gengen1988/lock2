lock2
======

It returns promise

example:

```js
const Lock = require('lock2')

let lock = new Lock()

async function demo() {
  await lock.acquire()

  // do your async job
  let value = await read()
  await write(value + 1)
  // they will be run in serial

  lock.release()
}
```

multiple?

```js
const Lock = require('lock2')

let lock1 = new Lock()
let lock2 = new Lock()

Promise.all([
  lock1.acquire(),
  lock2.acquire()
])
```
