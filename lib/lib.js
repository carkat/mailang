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

const matrixrotate = M => {
  if(M.every(x => x.length === M[0].length)) return M.map((x,i,a) => x.map((y,j) => M[j][i]))
}
const matrixRotateRight90 = (M,l=M.length) => {
  if(M.every(x => x.length === M[0].length)) return M.map((x,i,a) => x.map((y,j) => M[l-j-1][i]))
}
const matrixRotateLeft90 = (M, l=M.length) => {
  if(M.every(x => x.length === M[0].length)) return M.map((x,i,a) => x.map((y,j) => M[j][l-i-1]))
}

const snail = (A,l=A.length) => {
  var fn = a => matrixRotateLeft90(a).map(x => take(1-l,x))
  if(A.length === 1) return take(1,A)
  else{
    var rot = fn(A)
    return take(1,A).concat(take(1,rot)).concat(snail(fn(take(1-l, rot))))
  }
}