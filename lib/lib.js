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

Array.prototype.mix = function() {
  const list = this.map(x => l(x) ? x : [x]).sort((a, b) => l(b) - l(a))
  return list.map(x => x.take(l(list[0]))).map(x => x.map(y => y instanceof Array ? y.take(l(list[0])) : [y].take(l(list[0]))))
}
  
threeArg =  function(type, fn) {
  return eval(`this.${type}((x,i,A) => ${fn})`)
  
}

Array.prototype.m = function(fn) {
  return threeArg('map', fn)
  
}
Array.prototype.f = function(fn) {
  return threeArg('filter', fn)
  
}
Array.prototype.r = function(fn) {
  return eval(`this.reduce((x,y) => ${fn})`)
  
}
Array.prototype.ex = function(fn) {
  return threeArg('some', fn)
}
Array.prototype.el = function(fn) {
  return threeArg('find', fn)
}
Array.prototype.all = function(fn) {
  return threeArg('every', fn)
}
