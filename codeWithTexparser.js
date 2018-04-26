const fs           = require('fs')
const charCodeData = require('./parseTex')
const file = fs.readFileSync('./something.txt', 'UTF-8')


// console.log(charCodeData)
// console.log(file.split('\r\n').map((ln, lineNum, lns) => {
//     let modified = ln
//     Object.keys(charCodeData).forEach(symbol => {
//         if(ln.includes(symbol)){
//             modified = modified.replace(symbol, charCodeData[symbol].code)
//         }
//     })
//     return modified

// }))

const iota      = n   => [...Array(n).keys()].map(x => x + 1)
const factorial = n   => product(iota(n))
const Sigma     = arr => arr.reduce((a, b) => a + b)
const product   = arr => arr.reduce((a, b) => a * b)

const take = (num, arr) => {
  const n     = Math.abs(num)
  const len   = arr.length
  const nWholeArrays = Math.floor(n/len)

  const taker = a => iota(nWholeArrays).map(x => a)
    .reduce((x,y) => x.concat(y))
    .concat(a.slice(0,n - (len * nWholeArrays)))

  return num >= 0 && (len < n) 
    ? taker(arr)    
    : num <= 0 && (len < n)
    ? taker(arr.reverse())
    : len > n
    ? arr.slice(0, n)
    : arr
}

const rhoLoop = (shape, arr, all) =>{
  const more = shape.length > 1
  if(more){
    const now = shape[0]
    const nowA = iota(now)//[...Array(now).keys()]
    console.log(nowA)
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

var solution = (secret, passPhrase) => {
  const a = 'abcdefghijklmnopqrstuvwxyz'
  const key = rho([secret.length], passPhrase)
  return secret.map((char, i) => {
    const kChar                  = key[i]
    const alphabetIndexOfChar    = a.indexOf(char)
    const alphabetIndexOfKeyChar = a.indexOf(kChar)
    const rotated                = alphabetIndexOfChar + alphabetIndexOfKeyChar
    const mapToLengthAlphabet    = rotated % a.length
    return a[mapToLengthAlphabet]
  })
 }

 console.log(solution('thepackagehasbeendelivered'.split(''), 'snitch'.split('')))