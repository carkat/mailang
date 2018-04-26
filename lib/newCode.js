const rotate = (num, arr,n=num%arr.length) => 
  arr.map((x, i, a) => {
    const j = i + n < a.length
      ? i + n
      : (i - a.length) + n

      return j < a.length
        ? a[j] 
        : a[0]
  })
const add       = (a, b) => a + b
const exists    = (val, arr) => arr.includes(val)
const locate    = (val, arr) => arr.findIndex(x => x === val)
const locateAll = (val, arr) => arr.map((x,i) => x === val && i).filter(x=>x)
const forAll    = (fn,  arr) => arr.every((x,i,a)=>i+1<a.length?fn(x,i,a):true)
const Sigma     = (arr, fn=add)  => arr.reduce(fn)

