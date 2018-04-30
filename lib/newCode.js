const rotate    = (A,n,l=A.length,i=(n+l)%l) => A.slice(i).concat(A.slice(0,i))
const add       = (a, b)     => a + b
const exists    = (val, arr) => arr.includes(val)
const locate    = (val, arr) => arr.findIndex(x => x === val)
const locateAll = (val, arr) => arr.map((x,i) => x === val && i).filter(x=>x)
const forAll    = (fn,  arr) => arr.every((x,i,a)=>i+1<a.length?fn(x,i,a):true)
const drop      = (n,A)      => A.filter((x,i) => n>0?i>=n:i<(A.length+n))
const Sigma     = (arr, fn=add)  => arr.reduce(fn)
var flatten     = (arr,r=[]) => { 
    arr.foreach(x => x instanceof Array ? r.push(...flatten(x)) : r.push(x))
    return r
}



const intersect = (A,B) => {
    const f = (A,B) => A.filter(a=> !exists(a,B))
    return f(A,B).concat(f(B,A))
}

const roll = ints => ints.map(x=>(Math.floor(Math.random() * Math.floor(x)) + 1))
const deal = (n, max) => [...Array(n)].map(x => Math.floor(Math.random() * Math.floor(max)) + 1)

const suits = n => {
    const m = (n) => (n%13)+1
	return          n <= 13 ? [n,m(n), 'spades'] :
           n > 13 && n <=26 ? [n,m(n), 'hearts'] :
           n > 26 && n <=39 ? [n,m(n), 'clubs']  : 
                              [n,m(n), 'diamonds']
}