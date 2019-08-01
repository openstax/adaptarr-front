import * as React from 'react'
import { Editor as CoreEditor } from 'slate'
import { RenderBlockProps, RenderInlineProps, RenderMarkProps } from 'slate-react'

import Mention from '../Mention'

export function renderBlock(props: RenderBlockProps, editor: CoreEditor, next: () => any) {
    const { node, children, attributes } = props

    switch (node.type) {
    case 'paragraph':
        return <p {...attributes}>{children}</p>

    default:
        return next()
    }
}

export function renderMark(props: RenderMarkProps, editor: CoreEditor, next: () => any) {
    const { mark, children, attributes } = props

    switch (mark.type) {
    case 'emphasis':
        return <em {...attributes}>{children}</em>

    case 'strong':
        return <strong {...attributes}>{children}</strong>

    default:
        return next()
    }
}

export function renderInline(props: RenderInlineProps, editor: CoreEditor, next: () => any) {
    const { node, children, attributes } = props

    switch (node.type) {
    case 'hyperlink':
        const url = node.data.get('url')
        if (url.text.length === 0) {
            return <a href={url} {...attributes}>{url}</a>
        }
        return <a href={url} {...attributes}>{children}</a>

    case 'mention':
        return <Mention userId={node.data.get('user')} />

    default:
        return next()
    }
}
