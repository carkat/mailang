const parser = require('./parser')

const tree = parser.eval(parser.code)
const makeFn = node => {
    const fn =  `function ${node.name}(${makeArgs(node.args)}) {\n\t${makeBody(node.body)}\n};\n`
    console.log(fn)
    return fn
};
const makeArgs = args => args.map(x => x.length === 1 && x[0] === '_' ? 'nullVar = null' : x)
const makeBody = body => {
    return `return ${body}`
}

const makeVar = node => {
    const variable =  `const ${node.name} = ${node.value};\n`
    console.log(variable)
    return variable
}

const evalCodeTree = tree => {
    tree.map(node => {
        return node.is === 'function' && node.body 
        ? makeFn(node)
        : node.type === 'variable' ? makeVar(node) : null
    })
}
evalCodeTree(tree)