const ftl = require('fluent-syntax')
const glob = require('glob')
const fs = require('fs')
const { basename, dirname, resolve } = require('path')
const { promisify } = require('util')

module.exports = class FtlPlugin {
    constructor(options = {}) {
        const { input } = options

        this.input = input
    }

    apply(compiler) {
        const onEmit = async (compilation, callback) => {
            const paths = glob.sync(this.input)
            compilation.fileDependencies.push(...paths.map(path => resolve(path)))

            const results = await Promise.all(
                paths.map(path => this.processBundle(compilation, path)))

            const bundles = new Map()
            for (const [name, locale, messages] of results) {
                if (!bundles.has(name)) {
                    bundles.set(name, [locale, messages])
                    continue
                }

                const [reflocale, refmessages] = bundles.get(name)

                let onlyref = [...refmessages].filter(x => !messages.has(x))
                let onlynew = [...messages].filter(x => !refmessages.has(x))

                if (onlyref.length !== 0) {
                    compilation.errors.push(
                        `There are messages in ${reflocale}/${name} missing`
                        + ` from ${locale}/${name}:\n    `
                        + onlyref.join('\n    ')
                    )
                }

                if (onlynew.length !== 0) {
                    compilation.errors.push(
                        `There are messages in ${locale}/${name} missing`
                        + ` from ${reflocale}/${name}:\n    `
                        + onlynew.join('\n    ')
                    )
                }
            }

            callback()
        }

        compiler.plugin('emit', onEmit)
    }

    async processBundle(compilation, path) {
        const source = await promisify(fs.readFile)(path, { encoding: 'utf-8' })
        const messages = new Set()
        const ast = ftl.parse(source)

        for (const node of ast.body) {
            switch (node.type) {
            case 'Message':
                messages.add(node.id.name)
                break

            case 'Junk':
                for (const message of node.annotations) {
                    compilation.errors.push(this.formatError(path, source, message))
                }
                break
            }
        }

        const name = basename(path)
        const locale = basename(dirname(path))

        return [name, locale, messages]
    }

    formatError(path, source, error) {
        const lineStart = ftl.lineOffset(source, error.span.start)
        const lineEnd = ftl.lineOffset(source, error.span.end)
        const columnStart = ftl.columnOffset(source, error.span.start)

        let message = `${path}:${lineStart}:${columnStart}: ${error.message}`

        if (error.code) {
            message += ` [${error.code}]`
        }

        if (lineStart === lineEnd) {
            const start = source.lastIndexOf('\n', error.span.start) + 1
            const end = source.indexOf('\n', error.span.end)
            const line = source.substring(start, end === -1 ? undefined : end)

            const num = lineStart.toString()

            message += `\n ${num} | ${line}`
            message += `\n ${' '.repeat(num.length)} | ${' '.repeat(columnStart)}${'^'.repeat(end - start)}`
        }

        return message
    }
}
