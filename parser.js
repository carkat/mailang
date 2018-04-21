
const notDefined = (line,lineNum) => {
    // console.log('not defined')
    return [`not defined (${lineNum})`, line]

}

const checkIs = char => {
    const isList = {
        '{': 'dict',
        '[': 'arr',
        "'": 'string',
        'number': 'int'
    }
    if(Object.keys(isList).includes(char)){
        return isList[char]
    }
    else if(typeof(parseInt(char))=== 'number'){
        return isList['number']
    }
    else {
        return undefined
    }
}
    
const replaceAll = str => {
    return str.replace(/{ /g, '{')
    .replace(/\[ /g, '[')
    .replace(/\[ /g, '[')
    .replace(/ \}/g, '}')
    .replace(/ /g, ', ')
}


const parseArr = a => {
    return a
}
const parseDict = d => {
    return d
}
const parseAssignement = (ln, lineNum, lns, value) => {
    const parsed = (replaceAll(value.join(' ').replace(/`/g, ':')))
    const isInt  = !isNaN(parseInt(parsed))
    const isDict = parsed[0] === '{'
    const isArr  = parsed[0] === '['

    return {
        value  : parseInt(parsed)||parsed,
        is: isInt 
            ? 'int' 
            : isDict ? 'dict' 
            : isArr  ? 'arr'
            : typeof(parsed),
        message: typeof(parsed) === 'string' && [!isInt, !isDict, !isArr].reduce((a,b)=>a&&b) 
            ? 'parse the string to see if it has any computations required' : 'none'
    }
}

const parseFunctionBody = (ln, lineNum, lns, body) => {
    const symbols = [
        '*', '.*', '+', '/', '//', '->','-', '==', '/=' , '_',
        '|', '..'
    ]
    const bodyStr = body.join(' ')
    const guards  = body.find(str => str[0] === '|')

    const parseGuards        = (guards && ['|',...bodyStr.split('|').filter(x => x).map(str => str.trim())])
    const arrowContinuations = ['->', ...bodyStr.split('->').map(splt => splt.trim())]

    return {
        body: 
            guards ? parseGuards
            : arrowContinuations.length === 2 ? bodyStr 
            : arrowContinuations 
    }

}

const assignmentIsVariable = (ln, lineNum, lns) => {
    const declaration = ln[0]
    const value = ln[1]
    const name = declaration[0]
    const char = value[0]

    return {
        type: 'variable',
        name: name,
        ...parseAssignement(ln, lineNum, lns, value)
    }
}

const assignmentIsFunction = (ln, lineNum, lns) => {
    const declaration = ln[0]
    const body = ln[1]
    const name = declaration[0]

    return {
        type: 'function',
        is: 'function',
        name: name,
        args: declaration.slice(1),
        ...parseFunctionBody(ln, lineNum, lns, body)
    }
}

const lineIsAssignment = (ln, lineNum, lns) => {
    const declaration = ln[0]
    const value = ln[1]
    const name = declaration[0]
    const char = value[0]

    if(declaration.length === 1)
        return assignmentIsVariable(ln, lineNum, lns)

    return assignmentIsFunction(ln, lineNum, lns)
}

const lineIsFunctionWithGuards = (ln, lineNum, lns) => {
    let completeFuncWithGuards = ln
    let i = 1
    while(lns[lineNum + i][0][0] === '|'){
        completeFuncWithGuards += ` ${lns[lineNum + i][0]} `
        i++;
    }

    const final = completeFuncWithGuards
        .split(',')
        .join(' ')
        .trim()
        .split(' = ')
        .map(side => side.split(' '))
    
    const declaration = final[0]
    const body       = final[1]
    return {
        type: 'function',
        name: declaration[0],
        args: declaration.slice(1),
        ...parseFunctionBody(ln, lineNum, lns, body)
    }
}

const parseLn = (ln, lineNum, lns) => {
    const line = ln[0]

    /**
     * in this case, this line is an assignment
     * meaning that the line was of the form
     * var = val    //or
     * fn a b c = print a b c
     */
    return ln.length === 2
        ? lineIsAssignment(ln, lineNum, lns)


    /**
     *  in this case, the line is of the form
     *  fn a b c = 
     *    | a == b -> b
     *    | a == c -> c
     *    | a
     */
    : (line[line.length -1]==='=')
        ? lineIsFunctionWithGuards(line, lineNum, lns)

    /**
     * ignore lines that begine with | as they are processed
     * in the function 'lineIsFunctionWithGuards
     */
    : (line[0] === '|')
        ? ''

    /**
     * catch undefined behavior
     */
    : notDefined(line, lineNum)
}

const splitOnAssignment = ln => ln.split(' = ')
const trimWhiteSpace    = ln => ln.trim()
const emptyLines        = ln => ln.length
const comments          = ln => !(ln.slice(0,2) === '- ')
const splitEachSide     = ln => ln.map(
    splitLn => {    
      const splt = splitLn.trim().split(' ') 
      return splt.filter(x => x.length)     
    })

const eval = str => {
  const parsedFile = str.split('\n')
    .map(trimWhiteSpace)
    .filter(comments) 
    .filter(emptyLines)
    .map(splitOnAssignment)
    .map(splitEachSide)
    .map((ln, lineNum, lns) => parseLn(ln, lineNum, lns))
    return parsedFile
}

const code = (
  `
  - a comment
  myVar = 5
  abcd  = 6
  obj   = { one\`1 two\`2 three\`3 four\`4 myVar }
  nums  = [ 1 2 3 3 4 5 ]
  str   = 'hello world'
  fna a  = a * myVar
  fnb _  = print 'hello world'
  
  newFn a b = a + b
  fn1 a b   = 
   | a == b -> a
   | b
  

  fn2 a b = newFn a b -> fn1 a
  fn3 a b = 
    | fn1 a b > 1 -> 0
    | 1

  result = fn1 myVar abcd -> newFn str


  intList = [
    1 2 3 4 4 
  ]
  `
)
module.exports = {
    code,eval
}