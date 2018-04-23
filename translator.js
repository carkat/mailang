const parser = require('./parser')

const tree = parser.eval(parser.code)
const makeFn = node => {
    const fn =  `function ${node.name}(${makeArgs(node.args)}) {\n\t${makeBody(node.body)}\n};\n`
    console.log(fn)
    return fn
};
const makeArgs = args => args.map(x => x.length === 1 && x[0] === '_' ? 'nullVar = null' : x)
const makeBody = body => {
    return `return ${body};`
}

const makeVar = node => {
    let variable = ''
    if(node.is === 'arr')
        variable = `const ${node.name} = [${node.value}];\n`
    else if(node.is === 'dict'){
        const kvs = node.value.map(x =>{
            let [key,val] = x.split(':')
            if(val === undefined) val = key
            return `"${key}": "${val}"`
        })
        variable = `const ${node.name} = {${kvs}};\n`
    }
    else if(node.is === 'string')
        variable = `const ${node.name} = '${node.value}';\n`
    else 
        variable = `const ${node.name} = ${node.value};\n`
    console.log(variable)
    return variable
}

// - map over /
// - filter |
// - reduce _
// - count #
// - exists ? 
// - index of @

// arrayMethodSymbols <- '/ ... | _ # ? @ @@ << >> <=> ! <><|> \' ..'
// spread      = ...
// each        = ..
// map         = /
// filter      = |
// reduce      = _
// count       = #
// exists      = ?
// indOf       = @
// allIndOf    = @@
// rotateLeft  = <<
// rotateRight = >>
// reverse     = <=>
// sort        = !
// slice       = <|>

// - single quote
// unique      = '' 

const evalCodeTree = tree => {
    tree.map(node => {
        return node.is === 'function' && node.body 
        ? makeFn(node)
        : node.type === 'variable' ? makeVar(node) : null
    })
}
evalCodeTree(tree)