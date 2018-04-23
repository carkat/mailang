
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


const checkBracketBalance = (brackets, stack) => {
    const symbols = { all: '[{]}', open: '{[', close:'}]', '}': '{', ']':'[','{':'}', '[':']' }
    brackets.forEach(char => {
        symbols.open.includes(char) ? stack.push(char)
        : (symbols.close.includes(char)) && (stack[stack.length - 1] === symbols[char]) 
        ? stack.pop() : null
    })
    return stack
}
const parseMultiLineCollection = (ln, lineNum, lns, a, arr = '') => {
    console.log(ln, lns[lineNum])
    const symbols = { all: '[{]}', open: '{[', close:'}]', '}': '{', ']':'[','{':'}', '[':']' }
    let stack = checkBracketBalance(
       a.split('').filter(char => symbols.all.includes(char)),
        []
    )
    arr += lns[lineNum][1]

    while(stack.length){
        console.log(a)
        const nextLine = lns[++lineNum]
        stack = checkBracketBalance(
            nextLine[0].filter(char => symbols.all.includes(char)),
            stack
        )
        arr += `,${nextLine[0]}`
        //a stupid hack to clear out this line in the list of lines
        lns[lineNum] = '|'
    }
    if(!stack.length){
        console.log('success')
    }
    const parsed = (replaceAll(arr.replace(/`/g, ':')))
    return parsed.split(',').slice(1,-1)
}

const parseAssignement = (ln, lineNum, lns, value) => {
    const parsed = (replaceAll(value.join(' ').replace(/`/g, ':')))
    const isInt  = !isNaN(parseInt(parsed))
    const isDic  = parsed[0] === '{'
    const isArr  = parsed[0] === '['
    // console.log(parsed)

    return {
        value: isInt ? parseInt(parsed) 
             : isArr ? parseMultiLineCollection(ln, lineNum, lns, parsed)
             : isDic ? parseMultiLineCollection(ln, lineNum, lns, parsed)
             : parsed,
        is: isInt 
            ? 'int' 
            : isDic ? 'dict' 
            : isArr ? 'arr'
            : typeof(parsed),
        message: typeof(parsed) === 'string' && [!isInt, !isDic, !isArr].reduce((a,b)=>a&&b) 
            ? 'parse the string to see if it has any computations required' : 'none'
    }
}

const parseFunctionBody = (ln, lineNum, lns, body) => {
    const symbols = [
        '*', '.*', '+', '/', '//', '->','-', '==', '/=' , '_',
        '|', '..',
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
    console.log(parsedFile)
    return parsedFile
}


/**
 * first match all brackets
 * collapse brackets on multiple lines
 * 
 * dict is defined as a list with ` separated key values
 * dict = one`1 two`2 three`3 four`4
 * 
 * an array is defined as space separated values
 * arr = 1 2 3 4
 * 
 * nested arrays are semicolon separated 2 dimensional array
 * nestArr = 1 2 ; 1 2 3 ; 1 2 3 4
 * 1 2 
 * 1 2 3
 * 1 2 3 4
 * 
 * if a nested value is itself an array or object use parens
 * 1 2; 1 (2 3) ; (1 2) (three`3 four`4)
 * 1     2
 * 1     (2 3) 
 * (1 2) (three`3 four`4)
 * 
 * of cours variables can be inserted into arrays
 * twoThree  = 2 3
 * oneTow    = 1 2
 * threeFour = three`3 four`4
 * 1 2; 1 twoThree; oneTwo threeFour
 * 
 * a string is defined as any set of characters enclosed by ''
 * str = 'this is a string 
 * 
 * a string array is going to need special consideration
 * strArr = 'string1' 'string2' 'string3'
 * first split the line one '.+?', and count the indices. 
 * 
 * 
 * another special case will be functtion application
 * fn a b = a + b
 * arr = 
 *  fn 1 2 
 *  fn 3 4 
 *  fn 5 6
 * arrays must be typed instead of untyped
 * if there is already a type, then one cannot add a new type to an array to avoid confusion
 * 
 * what about simple function invocation
 * var = fn 1 2 
 * 
 * when a function is called, read the number of arguments. if the parser encounters a -> or 
 * another function before finishing applying enough arguments, or
 * if not enough arguments are passed (i.e., undefined, or another function application)
 * fn 1           - not enough arguments
 * fn 1 2 3 ->... - too many arguments
 * 
 * 
 */
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
      1 2 3
      4 5 6
      7 8 9 10
  ]
  object = {
      a\`a b\`b
      c\`c
  }

  `
)
module.exports = {
    code,eval
}