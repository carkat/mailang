const fs = require('fs')

const isAssign = ln => ln.includes('<-')
const isFNDecl = ln => ln.trim()[0] !== '|' 
  && ln.split('=')[0].indexOf('<') === -1
  && (
    ln[ln.length - 1] === '=' 
    || ln.includes(' = ')
  ) 
const isWhere  = ln => ln[0] === '?'
const getUntilNextLineIsBreak = (ln, lineNum, lns) =>{
  let result = ln
  let shouldContinue = true
  for(let i = lineNum; i < lns.length -1; ++i){
    const nextLine = lns[++lineNum]
    if(!nextLine.length)        return result
    else if(isFNDecl(nextLine)) return result
    else result = result +  ' \n ' + nextLine
    lns[lineNum] = ''
  }
  return result
}

const getUntilNextLineIsAssignmentOrDecl = (ln, lineNum, lns) =>{
  let result = ln
  let shouldContinue = true
  const linesToClear = []
  for(let i = lineNum; i < lns.length -1; ++i){
    const nextLine = lns[++lineNum]
    linesToClear.push(lineNum)
    if(isAssign(nextLine)){
      return result
    }
    else if(!nextLine.length)   return result
    else if(isFNDecl(nextLine)) return result
    else result = result +  '\n' + nextLine
  }
  lns.forEach((x,i) => linesToClear)

  
  return result
}

const groupAssignsAndDecls = group => 
  group
    .map((ln, lineNum, lns) =>
       isFNDecl(ln)
        ? getUntilNextLineIsBreak(ln, lineNum, lns)
      : isAssign(ln)
        ? getUntilNextLineIsAssignmentOrDecl(ln, lineNum, lns)
      : '')
    .filter(ln => ln.length)

const parseFile = file => {
  const noComments = (file.replace(/ +/g,' ').split('\r\n').filter(ln => (ln.slice(0,2) !== '- ')))
  const joinedGroupedLines = noComments
    .reduce((joined, line) => {
      if(line.length) return joined + ' <joined>' + line
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
    if(isFNDecl(ln)){
      const functionBody = ln
        .split(' = ').slice(1).join(' = ').split('\n').filter(x=>x).map(x => x)
      const functionHeader = ln
        .split(/\s=\s/)[0]
      // console.log(ln)

      return {
        type: 'function',
        name: functionHeader.split(' ')[0],
        args: functionHeader.split(' ').slice(1),
        body: functionBody
      }
    }
    else if(isAssign(ln)){
      const splitLine = ln
        .split(/\s<-\s/)
        .map(ln => ln)
      return {
        type: 'variable',
        name: splitLine[0],
        value: splitLine[1]
      }
    }
  }))

}

const file = fs.readFileSync('./test.m', 'UTF-8')
parseCode(parseFile(file))
// console.log(parseFile(file))

