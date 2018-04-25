const fs = require('fs')
const file = fs.readFileSync('./texSymbols.txt', 'UTF-8')

const getCharCodeData = file.split('\r\n').map((ln, lineNum, lns) => {
    let result = undefined
    if(ln.includes('//parseMe')){
        let json = []
        while(++lineNum < lns.length){
            json.push(lns[lineNum])

        }
        result = {}
        let parsed = JSON.parse(json.join(''))
        Object.keys(parsed).forEach(k => {
            result[parsed[k]] = {
                code: parsed[k].charCodeAt(0),
                char: k
            }
        })
    }
    return result
}).filter(x => x)[0]

module.exports = getCharCodeData
