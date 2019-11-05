import * as React from 'react'

import Mention from '../Mention'

const FRAME_PARA = 1
const FRAME_TEXT = 2
const FRAME_PUSH_FORMAT = 3
const FRAME_POP_FORMAT = 4
const FRAME_HYPERLINK = 5
const FRAME_MENTION = 6

type Data = Uint8Array
export default function Message({ data }: { data: Data }) {
  let type, len, inx

  ;[type, inx] = leb128(data, 0)
  ;[len, inx] = leb128(data, inx)

  const elements = Block({ data: data.subarray(inx, inx + len) })
  return (
    <div className="message">
      {elements.map(el => el)}
    </div>
  )
}

export function leb128(data: Data, inx=0) {
  let r = 0

  for (let shift = 0 ; inx < data.length ; shift += 7) {
    const byte = data[inx++]
    r = r | ((byte & 0x7f) << shift)

    if ((byte & 0x80) === 0) {
      break
    }
  }

  return [r, inx]
}

function *frames(data: Data): IterableIterator<[number, Data]> {
  for (let inx = 0; inx < data.length;) {
    let type, len

    ;[type, inx] = leb128(data, inx)
    ;[len, inx] = leb128(data, inx)

    yield [type, data.subarray(inx, inx + len)]
    inx += len
  }
}

function Block({ data }: { data: Data }): JSX.Element[] {
  const nodes: JSX.Element[] = []
  let key = 0

  for (const [type, body] of frames(data)) {
    switch (type) {
    case FRAME_PARA:
      nodes.push(<Paragraph key={key++} data={body} />)
      break

    default:
      console.warn('Unknown block frame:', type)
      break
    }
  }

  return nodes
}

class LineCtx {
  nodes: [JSX.Element[], number][] = [[[], 0]]

  key = 0

  top() {
    return this.nodes[this.nodes.length - 1]
  }

  addText(text: JSX.Element) {
    this.top()[0].push(text)
  }

  addInline(el: JSX.Element) {
    this.top()[0].push(el)
  }

  pushFormat(fmt: number) {
    for (const [, f] of this.nodes) {
      fmt &= ~f
    }
    if (fmt !== 0) {
      this.nodes.push([[], fmt])
    }
  }

  popFormat(fmt: number) {
    for (let i = this.nodes.length - 1; i > 0 && fmt !== 0; --i) {
      const [content, f] = this.nodes[i]

      if (content.length > 0) {
        this.nodes[i - 1][0].push(
          <Format key={this.key++} format={f}>{content}</Format>)
      }

      const new_f = f & ~fmt
      fmt &= ~f

      if (new_f === 0) {
        this.nodes.splice(i, 1)
      } else {
        this.nodes[i][0] = []
      }
    }
  }

  finish(): JSX.Element[] {
    while (this.nodes.length > 1) {
      const [content, f] = this.nodes.pop()!

      if (content.length > 0) {
        this.top()[0].push(
          <Format key={this.key++} format={f}>{content}</Format>)
      }
    }

    return this.nodes[0][0]
  }
}

function Line({ data }: { data: Data }): JSX.Element[] {
  const ctx = new LineCtx()

  for (const [type, body] of frames(data)) {
    switch (type) {
    case FRAME_TEXT:
      ctx.addText(decode_utf8(body))
      break

    case FRAME_PUSH_FORMAT:
      ctx.pushFormat(new DataView(body.buffer, body.byteOffset, body.byteLength)
        .getUint16(0, true))
      break

    case FRAME_POP_FORMAT:
      ctx.popFormat(new DataView(body.buffer, body.byteOffset, body.byteLength)
        .getUint16(0, true))
      break

    case FRAME_HYPERLINK: {
      const [len, inx] = leb128(body, 0)
      const label = decode_utf8(body.subarray(inx, inx + len))
      let url = String.fromCodePoint.apply(null, body.subarray(inx + len))
      if (/^www\./.test(url)) {
        url = 'http://' + url
      }

      ctx.addInline(
        <a
          key={ctx.key++}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {label}
        </a>
      )
      break
    }

    case FRAME_MENTION:
      ctx.addInline(<Mention key={ctx.key++} data={body} />)
      break

    default:
      console.warn('Unknown text frame:', type)
      break
    }
  }

  return ctx.finish()
}

function Paragraph({ data }: { data: Data }) {
  const elements = Line({ data })
  return <p>{elements}</p>
}

function decode_utf8(data: Data) {
  const text = []

  for (let inx = 0 ; inx < data.length ;) {
    const byte = data[inx++]
    let cp
    let len = 0

    if ((byte & 0x80) === 0) {
      cp = byte
    } else if ((byte & 0xe0) === 0xc0) {
      cp = byte & 0x1f
      len = 1
    } else if ((byte & 0xf0) === 0xe0) {
      cp = byte & 0x0f
      len = 2
    } else if ((byte & 0xf8) === 0xf0) {
      cp = byte & 0x07
      len = 3
    } else {
      throw new Error("Invalid UTF-8 start byte: " + byte)
    }

    for (let i=0 ; i < len ; ++i) {
      cp = (cp << 6) | (data[inx++] & 0x3f)
    }

    text.push(cp)
  }

  return String.fromCodePoint.apply(null, text)
}

const FORMATS: [number, string][] = [
  [0x0001, 'em'],
  [0x0002, 'strong'],
]

function Format({ format, children }: { format: number, children: any }) {
  for (const f of FORMATS) {
    // We destructure this manually because we want to use "as 'em' | 'strong'"
    // for typescript to work.
    const fmt = f[0]
    const Tag = f[1] as 'em' | 'strong'
    if ((format & fmt) === fmt) {
      format &= ~fmt
      children = <Tag>{children}</Tag>
    }
  }

  return children
}
