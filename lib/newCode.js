// const rotate = (A, num ) => {
//   return A.map((x,i,a) => {
//      const n = num + i
//      return n < 0 
//        ? A[(((n % A.length) + A.length) % A.length)]
//        : n < A.length 
//        ? A[n] 
//        : A[n % A.length]
//   })
// }
const rotate = ((A,x,l=A.length)=>A.map((v,i,a,n=x+i)=>n<0?A[(((n%l)+l)%l)]:n<l?a[n]:a[n%l]))

const add       = (a, b)     => a + b
const exists    = (val, arr) => arr.includes(val)
const locate    = (val, arr) => arr.findIndex(x => x === val)
const locateAll = (val, arr) => arr.map((x,i) => x === val && i).filter(x=>x)
const forAll    = (fn,  arr) => arr.every((x,i,a)=>i+1<a.length?fn(x,i,a):true)
const Sigma     = (arr, fn=add)  => arr.reduce(fn)

