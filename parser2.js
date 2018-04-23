const fs = require('fs')

const getUntilNextAssign = (ln, lineNum, lns) =>{
  return ln
  return `this is an assign ${ln}`

}

const getUntilNextFn = (ln, lineNum,  lns) =>{
  return `this is a fn ${ln}`

}
const parse = file => {
  const noComments = (file.split('\r\n').filter(ln => (ln.slice(0,2) !== '- ')))
  console.log(noComments
  .reduce((joined, line) => {
    if(line.length) return joined + ' <joined>' + line.trim()
    else return joined + ' <grouped>' 
  })
  .split(' <grouped>')
  .map(group => group.split(' <joined>'))
  .map(group => {
    return group.map((ln, lineNum, lns) => {
        if(ln.includes('<-')){
          return getUntilNextAssign(ln, lineNum, lns)
        }
        else if (ln[0] !== '|' && (ln[ln.length - 1] === '=' || ln.includes(' = '))){
          console.log(ln)
          return getUntilNextFn(ln, lineNum, lns)
        }
        return ln

      })
  }))
}

const file = fs.readFileSync('./test.m', 'UTF-8')
parse(file)

