const fs           = require('fs')
const charCodeData = require('./parseTex')
const file = fs.readFileSync('./something.txt', 'UTF-8')


console.log(charCodeData)
console.log(file.split('\r\n').map((ln, lineNum, lns) => {
    let modified = ln
    Object.keys(charCodeData).forEach(symbol => {
        if(ln.includes(symbol)){
            modified = modified.replace(symbol, charCodeData[symbol].code)
        }
    })
    return modified

}))