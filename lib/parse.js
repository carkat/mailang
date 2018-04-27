const fs = require('fs')

//funcs
const join   = (ln, lineNum, lns) => {
  let combined = [ln]
  let cont = true
  while(cont){
    const newLn = lns[++lineNum]
    if(newLn && newLn[0] === ' ') combined.push(newLn)
    else cont = false
  }
  return combined.join('\n').trim()
}

const gc       = c  => String.fromCharCode(c)
const isIndent = ln => ln[0] !== ' '
const isVar    = ln => ln && ln.includes(gc(vc.code))  && isIndent(ln);
const isFun    = ln => ln && ln.includes(gc(fnc.code)) && isIndent(ln);
const getOperatorData = str => Object.keys(sombolsWithCodes)
  .map(k=>sombolsWithCodes[k])
  .filter(k => k.def.includes(str))

const parseVar = Var => {
  const [name, value] = Var.split(gc(vc.code))
  
  return {
    plainText: Var,
    type: "V",
    name: name.trim(),
    value: value
  }
}

const parseBody = body => {
  const [whereSymbol] = getOperatorData('where')
  const symbol        = gc(whereSymbol.code)
  const splitBody     = body.split(symbol)
  const main          = splitBody[0]
  const where         = splitBody.slice(1).join(symbol)
  let modifiedWhere   = undefined
  if(where){

    modifiedWhere = JoinAndParseBody(where.split('\n').map((ln,lineNum,lns) => {
      return symbols.includes(ln.trim()[0]) ? ln : ln.trim()
    }))

  }
  return {
    main: main.trim(), where: where && modifiedWhere 
  }
}
const parseFun = fun => {
  const splitFun  = fun.split(gc(fnc.code))
  const funBody   = parseBody(splitFun.slice(1).join(gc(fnc.code)))
  const funHeader = splitFun[0].split(' ').filter(x=>x)
  const funName   = funHeader[0]
  const funArgs   = funHeader.slice(1)
  if(funBody.where)
  {
    
    console.log(funBody.where.body)
  }

  return {
    plainText: fun,
    type: 'f',
    name: funName.trim(),
    args: funArgs.map(x=>x.trim()),
    body: funBody,
  }
}


//from def
const def       = JSON.parse(fs.readFileSync('./lib/libDef.txt','UTF-8'))
const symbols   = Object.keys(def)
const sombolsWithCodes   = Object.assign({},...symbols.map(k => ({[k]: {...def[k], code: k.charCodeAt(0)}})))
const [vc, fnc] = getOperatorData('assignment')

//from file
const file     = fs.readFileSync('./lib/lib.txt', 'UTF-8')
const codeOnly = file.split('\r\n').filter(ln => ln.slice(0,2) !=='- ').filter(x => x.length)

const JoinAndParseBody = body => body
  .map((ln, lineNum, lns) => (isVar(ln)||isFun(ln)) && join(ln, lineNum,lns))
  .filter(x => x)
  .map(ln => {
    const name = isFun(ln) ? 'Fun' : 'Var'
    return ({[name]: ln})
  }).map(ln => ln.Var ? parseVar(ln.Var) : parseFun(ln.Fun))

// const joined   = codeOnly
//   .map((ln, lineNum, lns) => (isVar(ln)||isFun(ln)) && join(ln, lineNum,lns))
//   .filter(x => x)
  
const joinedAndParsed = JoinAndParseBody(codeOnly)
// const parsed = joined
//   .map(ln => {
//     const name = isFun(ln) ? 'Fun' : 'Var'
//     return ({[name]: ln})
//   })
//   .map(ln => ln.Var ? parseVar(ln.Var) : parseFun(ln.Fun))
 

console.log(joinedAndParsed.filter(x => x.type === 'f'))