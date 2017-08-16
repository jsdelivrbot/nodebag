#! /usr/bin/env node

const fs = require('fs')
const path = require('path')
const commonFile = require('@suning/cd-webpack-config')

let customWebpackPath = path.resolve(process.cwd(), 'webpack.config.js')
let customFile = fs.readFileSync(customWebpackPath, 'utf8')
// let commonWebpackPath = path.resolve(process.cwd(), 'node_modules/@suning/cd-webpack-config/index.js')
// let commonFile = fs.readFileSync(commonWebpackPath, 'utf8')

class StrObj {
    constructor(str) {
        this.str = str
    }

    getProperty(name) {
        return this.str.substring(this.getPropertyStart(name), this.getPropertyEnd(name) + 1)
    }

    setProperty(name, value) {
        this.str = this.str.substring(0, this.getPropertyStart(name)) + value + this.str.substring(this.getPropertyEnd(name) + 1)
    }

    getPropertyStart(name) {
        let nameStart = this.str.indexOf(name),
            valueStart, total

        if (nameStart !== -1) {
            total = this.str.substr(nameStart)
            valueStart = total.indexOf('{')
            if (valueStart !== -1) {
                return nameStart + valueStart
            }
        }
        return null
    }
    getPropertyEnd(name) {
        let valueStart = this.getPropertyStart(name),
            value

        if (valueStart) {
            value = this.str.substr(valueStart)

            let index = 1,
                i = 0
            while (index) {
                i++
                if (value[i] === '{') {
                    index++
                } else if (value[i] === '}') {
                    index--
                }
            }
            return valueStart + i
        }
        return null
    }
}

let customConfig = new StrObj(customFile)
let devServer = customConfig.getProperty('devServer')
let commonConfig = new StrObj(commonFile)
commonConfig.setProperty('devServer', devServer)
fs.writeFileSync(customWebpackPath, commonConfig.str, 'utf8')