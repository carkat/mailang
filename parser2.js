const fs = require('fs')

const isAssign = ln => ln.includes('<-')
const isFNDecl = ln => ln[0] !== '|' && (ln[ln.length - 1] === '=' || ln.includes(' = '))

const getUntilNextLineIsAssignmentOrDecl = (ln, lineNum, lns) =>{
  let result = ln
  let shouldContinue = true
  for(let i = lineNum; i < lns.length -1; ++i){
    const nextLine = lns[++lineNum]
    if(isAssign(nextLine))      return result
    else if(!nextLine.length)   return result
    else if(isFNDecl(nextLine)) return result
    else result = result +  ' ' + nextLine
  }
  return result
}
const groupAssignsAndDecls = group => 
  group
    .map((ln, lineNum, lns) =>
      isAssign(ln)
        ? getUntilNextLineIsAssignmentOrDecl(ln, lineNum, lns)
      : isFNDecl(ln)
        ? getUntilNextLineIsAssignmentOrDecl(ln, lineNum, lns)
      : '')
    .filter(ln => ln.length)

const parseFile = file => {
  const noComments = (file.split('\r\n').filter(ln => (ln.slice(0,2) !== '- ')))
  const joinedGroupedLines = noComments
    .reduce((joined, line) => {
      if(line.length) return joined + ' <joined>' + line.trim()
      else return joined + ' <grouped>' 
    })
    .split(' <grouped>')
    .map(group => group.split(' <joined>'))
    .map(groupAssignsAndDecls)
    .filter(x => x.length)

  const declarationSeparatedLines = [].concat.apply([], joinedGroupedLines);
  return declarationSeparatedLines
}

const parseCode = code => {
  console.log(code.map(ln => {
    if(isAssign(ln)){
      const splitLine = ln
        .split('<-')
        .map(ln => ln.trim().split(' '))
      return {
        name: splitLine[0],
        value: splitLine[1]
      }


    }
  }))

}

const file = fs.readFileSync('./test.m', 'UTF-8')
parseCode(parseFile(file))

