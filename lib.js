const fs = require('fs')
const file = fs.readFileSync('./cipher.txt', 'UTF-8')

const iota      = n   => [...Array(n).keys()].map(x => x + 1)
const factorial = n   => product(iota(n))
const Sigma     = arr => arr.reduce((a, b) => a + b)
const product   = arr => arr.reduce((a, b) => a * b)
const count     = arr => arr.length

const take = (num, arr) => {
  const n     = Math.abs(num)
  const len   = arr.length
  const nWholeArrays = Math.floor(n / len)

  const taker = a => iota(nWholeArrays).map(x => a)
    .reduce((x,y) => x.concat(y))
    .concat(a.slice(0,n - (len * nWholeArrays)))

  return num >= 0 && (len < n) 
    ? taker(arr)    
    : num <= 0 && (len < n)
    ? taker(arr.reverse())
    : num >= 0 && len > n
    ? arr.slice(0, n)
    : num <= 0 && len > n
    ? arr.slice(num)
    : arr
}

const rhoLoop = (shape, arr, all) =>{
  const more  = shape.length > 1
  if(more){
    const now  = shape[0]
    const nowA = iota(now)
    return nowA.map(n => {
      return rhoLoop(shape.slice(1), arr, all)
    })
  }
  else {
    return all.splice(0,take(1, shape))
  }
}

const rho = (shape, arr) => {
  const all  = take(product(shape), arr)
  return rhoLoop(shape, arr, all)
}


