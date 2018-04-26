//functions must be followed by a blank line unless it is a one line operation
const globalOperators = {
  langOps: {
      assign: '<-'
    , then: '->'
    , forwardArgPassContinuation: '->'
    , infixFnDecl: '`'
    , whereIn: '?'
  },
  unary: {
      mul: '*'
    , dotProduct: '.*'
    , square: '**'
    , add: '+'
    , div: '/'
    , sub: '-'
    , mod: '//'
    , gt: '>'
    , gte: '>='
    , eq: '='
    , lt: '<'
    , lte: '<='
  },
  grouping: {
      arraySubArray: '()'
    , subArray: ';'
    , listComp: '{}'
    , emptyArr: '[]'
    , emptyDictOrObj: '{}' 
    , keyValSeparator: '`'
  },
  logical: {
      if: '|'
    , iff: '<->'
    , xor: '!<->'
    , and: '&'
    , or: 'V'
  },
  arrayMethods: {
      map: '/'
    , filter: '|'
    , reduce: '_'
    , indexAt: '@'
    , allIndeces: '@@'
    , exists: '?'
    , unique: '`'
    , flatten: '...'
    , each: '..', 
  }
}

var solution = (secret, passPhrase) => {
  const a = 'abcdefghijklmnopqrstuvwxyz'
return secret.split('').map(((k,char,i) => {
     return a[(a.indexOf(char) + a.indexOf(k[i])) % a.length]
  })(rho(secret.length, passPhrase.split(''))))
}