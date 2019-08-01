import React from 'react'
import { KeyUtils, Point } from 'slate'

export default function Mention(options) {
    const types = options.types.map(type => ({
        type: type.type,
        pattern: RegExp(`${type.startChar}\\w*`),
    }))

    const ctx = {
        types,
        completion: null,
    }

    return {
        schema,
        // onBeforeInput: (...args) => onBeforeInput(types, ...args),
        onChange: (...args) => onChange(ctx, ...args),
        renderAnnotation,
        renderEditor: (...args) => renderEditor(ctx, ...args),
    }
}

const schema = {

}

function onBeforeInput(types, ev, editor, next) {
    for (const type of types) {
        for (const match of ev.data.matchAll(type.pattern)) {
            console.log('FOUND', match)
            console.log(editor.value.selection.toJS())
        }
    }

    return next()
}

function onChange(ctx, editor, next) {
    for (const op of editor.operations) {
        if (op.type === 'insert_text') {
            const space = op.text.match(/\s/)
            const node = editor.value.document.getNode(op.path)

            if (space != null) {
                const point = Point.create({
                    key: node.key,
                    path: op.path,
                    offset: op.offset + space.index,
                })

                for (const type of ctx.types) {
                    const anno = editor.value.annotations.find(anno =>
                        anno.type === type.type && point.isInRange(anno))

                    if (anno != null) {
                        console.log('SPACE IN MENTION', anno)
                    }
                }
            }

            for (const type of ctx.types) {
                const match = op.text.match(type.pattern)

                if (match == null) {
                    continue
                }

                const start = Point.create({
                    key: node.key,
                    path: op.path,
                    offset: op.offset + match.index,
                })

                const end = Point.create({
                    key: node.key,
                    path: op.path,
                    offset: op.offset + match.index + match.length,
                })

                const anno = editor.value.annotations.find(anno =>
                    anno.type === type.type && (start.isInRange(anno) || end.isInRange(anno)))

                if (anno != null) {
                    continue
                }

                editor.withoutSaving(() => {
                    editor.addAnnotation({
                        key: KeyUtils.create(),
                        type: type.type,
                        anchor: start,
                        focus: end,
                    })
                })

                console.log(match)
                console.log(op.toJS())
                break
            }
        }
    }
}

function renderAnnotation(props, editor, next) {
    const { children, annotation, attributes } = props

    switch (annotation.type) {
    case 'mention':
        return <span className="mention" {...attributes}>{children}</span>

    default:
        return next()
    }
}

function renderEditor(ctx, props, editor, next) {
    return <>
        <Completion ctx={ctx} editor={editor} />
        {next()}
    </>
}

class Completion extends React.Component {
    render() {
        const { editor, ctx } = this.props
        const { selection, annotations } = editor.value

        const annos = annotations
            .filter(anno => selection.anchor.isInRange(anno))
            .filter(anno => ctx.types.some(ty => anno.type === ty.type))

        return <div className="mention-suggestions">
            {JSON.stringify(annos.toJS())}
        </div>
    }
}
