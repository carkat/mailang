const fs = require('fs')
const file = fs.readFileSync('./lib/lib.txt', 'UTF-8')

const def     = JSON.parse(fs.readFileSync('./lib/libDef.txt','UTF-8'))
const symbols = Object.keys(def)
console.log(symbols.map(k => {
  return {
    [k]: {...def[k], code: k.charCodeAt(0)}
  }
}))

const codeOnly = file.split('\r\n').filter(ln => ln.slice(0,2) !=='- ').filter(x => x.length)


const join   = (ln, lineNum, lns) => {
  let combined = []
  combined.push(ln)
  let cont = true
  while(cont){
    const newLn = lns[++lineNum]
    if(newLn && newLn[0] === ' ')
      combined.push(newLn)
    else cont = false
  }
  return combined.join('\n').trim()
}
const isVar = ln => ln && ln.includes(String.fromCharCode(8592)) && ln[0] !== ' ';
const isFun = ln => ln && ln.includes('=') && ln[0] !== ' ' && ln.split('=')[0].split(' ').length > 1;
const joined = codeOnly
  .map((ln, lineNum, lns) => (isVar(ln)||isFun(ln)) && join(ln, lineNum,lns))
  .filter(x => x)
  .map(ln => {
    const name = isVar(ln) ? 'Var' : 'Fun'
    return ({[name]: ln})
  })
  
console.log(joined)