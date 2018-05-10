const bitSymbols = '<>|&='
const enlist     = (...arrs) => arrs.disclose()
const l          = A => A.length
const i          = n => [...Array(Math.abs(n)).keys()].map(x => x + 1);
const zeros      = n => [...Array(n)].map(x=>0)

Array.prototype.take = function(n) {
  return n > l(this)
    ? this.concat(zeros(n - l(this)))
    : n < 0 && Math.abs(n) > this.length
    ? zeros(Math.abs(n+1)).concat(this)
    : n < 0
    ? this.slice(n)
    : this.slice(0,n)
}

Array.prototype.drop = function(n) {
  return Math.abs(n) > l(this) 
  ? []
  : n < 0 
  ? this.slice(0, n + l(this))
  : this.slice(n)
}

Array.prototype.reshape = function (...s) {
  const size = s.reduce((a,b) => a * b)
  const all  = i(size).map(x => this[(x-1) % l(this)])
  const loop = (allVals, shape) => {
    if(l(shape) > 1){
      const curShape = i(shape.take(1)[0])
      return curShape.map(n => loop(allVals, shape.drop(1)))
    }
    else {
      return allVals.splice(0, shape.take(1)[0])
    }
  }
  return loop(all, s)
}

Array.prototype.between = function(op) {
  const result = this.map((x, i, A) => {
    if(i === 0) return x
    return eval(`A.take(i).reduce((a, b) => a ${op} b) ${op}  x`)
  })
  
  if(op.split('').find(x => bitSymbols.includes(x)))
    return result.map((x,i) => i === 0 ? x : x ? 1 : 0)
  return result
}

Array.prototype.betweefn = function(fn) {
  const result =  this.map((x, i, A => {
    if(i === 0) return x
    return fn(A.take(i).reduce((x,y) => fn(x,y)))
  }))


}

Array.prototype.redeuce = function(op) {
  return eval(`this.reduce((a,b) => a ${op} b)`)
}


Array.prototype.rows = function(...ns) {
  return ns.map(x => this[x-1] || [])
}

Array.prototype.cols = function(...ns) {
  if(this[0].hasOwnProperty('length'))
    return this.map(row => ns.map(x => row.filter((z,i) => i === x  - 1)).reduce((a,b) => a.concat(b)))
  else 
    return ns.map(x => this[x-1]) 
}

Array.prototype.enclose = function() {
  return [this]
}

Array.prototype.disclose = function() {
  if(!this.every(x => x.hasOwnProperty('length')))
    return this
  else{
    return this.reduce((a,b) => [...a, ...b])
  }
}

Array.prototype.bfn = function(fn) {
  const result =  this.map((y, i, A) => {
    if(i === 0) return y
    const x = A.take(i).reduce((x,y) => eval(fn))
    return eval(fn)
  })
  return result
}

Array.prototype.m = function(fn) {
  return eval(`this.map((x,i,A) => ${fn})`)
  
}
Array.prototype.f = function(fn) {
  return eval(`this.filter((x,i,A) => ${fn})`)
  
}
Array.prototype.r = function(fn) {
  return eval(`this.reduce((x,y) => ${fn})`)
  
}
Array.prototype.ex = function(fn) {
  return eval(`this.some((x,y) => ${fn})`)
}
Array.prototype.el = function(fn) {
  return eval(`this.find((x,i,A) => ${fn})`)
}
Array.prototype.ea = function(fn) {
  return eval(`this.forEach((x,i,A) => ${fn})`)
}
Array.prototype.all = function(fn) {
  return eval(`this.every((x,i,A) => ${fn})`)
}

const transpose = M => {
  if(M.every(x => x.length === M[0].length)) return M.map((x,i,a) => x.map((y,j) => M[j][i]))
}
const matrixRotateRight90 = (M,l=M.length) => {
  if(M.every(x => x.length === M[0].length)) return M.map((x,i,a) => x.map((y,j) => M[l-j-1][i]))
}
const matrixRotateLeft90 = (M, l=M.length) => {
  if(M.every(x => x.length === M[0].length)) return M.map((x,i,a) => x.map((y,j) => M[j][l-i-1]))
}
const rotate = (n, A, i = (n + l(A)) % l(A)) => enlist(A.drop(i), A.take(i))

Array.prototype.rotate = function(n) {
  const MatrixLoop = (M,n) => {
    return n > 0 
    ? MatrixLoop(matrixRotateRight90(M), n - 1)
    : n < 0 
    ? MatrixLoop(matrixRotateLeft90(M), n + 1)
    : M
  }
  if(this[0] instanceof Array){
    return n ? MatrixLoop(this,n) : transpose(this)
  }
  else
    return rotate(n, this)
}

const a = i(9)
const b = 3
a.bfn('x + y').reshape(3,3).rotate(3)