const fs = require('fs')


//joins lines which are part of the same declaration
const join = (ln, lineNum, lns) => {
  let isFn     = isFun(ln)
  // return [ln].concat((lns.slice(lineNum).map(newLn => {
  //   const lineIsEitherIndentedOrAWhereStatementBodyOfFn = newLn 
  //     && (newLn[0] === ' ' 
  //     || (symbols.includes(newLn[0]) && isFn && !isFun(newLn)))

  //   if(lineIsEitherIndentedOrAWhereStatementBodyOfFn) return newLn
  // }))).join('\n').trim()
  let combined = [ln]
  let cont = true
  while(cont){
    const newLn = lns[++lineNum]
    const lineIsEitherIndentedOrAWhereStatementBodyOfFn = newLn 
      && (newLn[0] === ' ' 
      || (symbols.includes(newLn[0]) && isFn && !isFun(newLn)))

    if(lineIsEitherIndentedOrAWhereStatementBodyOfFn) combined.push(newLn)
    else cont = false
  }
  return combined.join('\n').trim()
}

const JoinAndParseBody = body => {
  return body
    .map((ln, lineNum, lns) =>{
      //join and parse all lines which belong to a single declaration
      //new types of lines can be added here
      //such as single function invocation
        if(isFun(ln)) return parseFun(join(ln,lineNum, lns))
        else if(isVar(ln)) return parseVar(join(ln,lineNum, lns))
    })
    .filter(x => x) //all lines which are not a declaration are filtered here
}

const getOperatorData = str => Object.keys(symbolsWithCodes)
  .map(k=>symbolsWithCodes[k])
  .filter(k => k.def.includes(str))

const gc        = c  => String.fromCharCode(c)
const isIndent  = ln => ln[0] !== ' '
const notSymbol = ln => !symbols.includes(ln[0])
const isVar     = ln => ln && ln.includes(gc(vc.code))  && isIndent(ln) && notSymbol(ln) && comesFirst(ln, gc(vc.code), gc(fnc.code));
const isFun     = ln => ln && ln.includes(gc(fnc.code)) && isIndent(ln) && notSymbol(ln) && comesFirst(ln, gc(fnc.code), gc(vc.code))
const comesFirst = (ln, c1, c2) => {
  console.log(ln)
  if(!ln.split(c1)[0].includes(c2))
    console.log(ln.split(c1)[0], ' on ', c1, ' does not include ', c2)
  else
    console.log(ln.split(c1)[0], ' on ', c1, ' INCLUDES ', c2)
  return !ln.split(c1)[0].includes(c2)
}

const parseVar = Var => {
  const [name, value] = Var.split(gc(vc.code))
  return {
    name: name.trim(),
    value: value,
    plainText: Var,
    type: "V",
  }
}

const parseBody = body => {
  const [whereSymbol] = getOperatorData('where')
  const symbol        = gc(whereSymbol.code) //operator data.code is the unicode number of the symbole we want
  const splitBody     = body.split(symbol)   //split the body into the return value and everything else
  const main          = splitBody[0]         

  //the line where begins with :
  const whereBegins   = body.split('\n').findIndex(x => x.trim()[0] === symbol)

  //collect all the lines after the where : for this function
  const whereBody     = body.split('\n').filter((x,i) => whereBegins > 0 && i >= whereBegins)

  //get the index of the first (character !== ':'), this is the indentation level 
  const indexOfIndentation         = where => where[0].split('').findIndex(x => x !== ' ' && notSymbol(x))

  //the actual value to return. recursively construct function block scope
  const where = whereBody.length
    ? JoinAndParseBody(whereBody.map(x=>x.slice(indexOfIndentation(whereBody)))) 
    : []

  return {
    main: main.trim(), where: where 
  }
}
const parseFun = fun => {
  const splitFun  = fun.split(gc(fnc.code))
  const funBody   = parseBody(splitFun.slice(1).join(gc(fnc.code)))
  const funHeader = splitFun[0].split(' ').filter(x=>x)
  const funName   = funHeader[0]
  const funArgs   = funHeader.slice(1)

  return {
    name: funName.trim(),
    args: funArgs.map(x=>x.trim()),
    body: funBody,
    plainText: fun,
    type: 'f',
  }
}

//from def
const def              = JSON.parse(fs.readFileSync('./lib/libDef.txt','UTF-8'))
const symbols          = Object.keys(def)
const symbolsWithCodes = Object.assign({},...symbols.map(k => ({[k]: {...def[k], code: k.charCodeAt(0)}})))
const [vc, fnc]        = getOperatorData('assignment')

//from file
const file     = fs.readFileSync('./lib/lib.txt', 'UTF-8')
const codeOnly = file.split('\n').filter(ln => ln.slice(0,2) !=='- ').filter(x => x.length)


const joinedAndParsed = JoinAndParseBody(codeOnly)

fs.writeFileSync('a.json', JSON.stringify(joinedAndParsed),'utf-8')
console.log('check ./a.json')