import { Text, Inline, Block, Value, Mark } from 'slate'

/**
 * Mapping from slate marks to formatting flags.
 */
const MARKS = {
  emphasis: 1,
  strong: 2,
}

const FRAME_MESSAGE = 0
const FRAME_PARA = 1
const FRAME_TEXT = 2
const FRAME_PUSH_FORMAT = 3
const FRAME_POP_FORMAT = 4
const FRAME_HYPERLINK = 5
const FRAME_MENTION = 6

/**
 * Write a LEB128 encoded number to a buffer.
 */
function leb128(buf: number[], v: number) {
  let s = 0
  for (; (v >> s) > 0 ; s += 7) {}
  s -= 7

  for (; s > 0 ; s -= 7) {
    buf.push(((v >> s) & 0x7f) | 0x80)
  }

  buf.push(v & 0x7f)
}

/**
 * Encode a single frame.
 */
function frame(bytes: number[], type: number, body: number[]) {
  leb128(bytes, type)
  leb128(bytes, body.length)
  bytes.push.apply(bytes, body)
}

/**
 * Encode string as UTF-8.
 */
function encodeUtf8(str: string, into: number[] | null = null) {
  const bytes: number[] = into || []

  for (const char of str) {
    const cp = char.codePointAt(0)!
    let len

    if (cp >= 0x10000) {
      len = 18
      bytes.push(0xf0 | ((cp >> 18) & 7))
    } else if (cp >= 0x800) {
      len = 12
      bytes.push(0xe0 | ((cp >> 12) & 0xf))
    } else if (cp >= 0x80) {
      len = 6
      bytes.push(0xc0 | ((cp >> 6) & 0x1f))
    } else {
      len = 0
      bytes.push(cp)
    }

    for (; len > 0 ;) {
      len -= 6
      bytes.push(0x80 | ((cp >> len) & 0x3f))
    }
  }

  return bytes
}

function text(bytes: number[], node: Text, lastFormat: number) {
  let format = 0

  for (const mark of (node as unknown as {marks: Mark[]}).marks) {
    format |= MARKS[mark.type]
  }

  let pop = lastFormat & ~format
  let push = format & ~lastFormat

  // NOTE: Push and pop formatting are fixed-length frames, so we can
  // hard-code then and skip allocation for frame().
  if (pop !== 0) {
    bytes.push.call(bytes, FRAME_POP_FORMAT, 0x02, pop & 0xff, pop >> 8)
  }
  if (push !== 0) {
    bytes.push.call(bytes, FRAME_PUSH_FORMAT, 0x02, push & 0xff, push >> 8)
  }

  const text = encodeUtf8(node.text)
  frame(bytes, FRAME_TEXT, text)

  return format
}

function inline(bytes: number[], node: Inline) {
  const body: number[] = []

  switch (node.type) {
  case 'hyperlink':
    const label = encodeUtf8(node.text)
    leb128(body, label.length)
    body.push.apply(body, label)
    encodeUtf8(node.data.get('url'), body)
    frame(bytes, FRAME_HYPERLINK, body)
    break

  case 'mention':
    const user = node.data.get('userId')
    leb128(body, user)
    frame(bytes, FRAME_MENTION, body)
    break

  default:
    throw new Error(`invalid inline: ${node.toJS()}`)
  }
}

/**
 * Encode a text block as a series of line frames
 */
function textBlock(block: Block) {
  const bytes: number[] = []
  let format = 0

  for (const node of block.nodes.toArray()) {
    switch (node.object) {
    case 'text':
      format = text(bytes, node, format)
      break

    case 'inline':
      inline(bytes, node)
      break

    default:
      throw new Error(`unsupported ${node.object}`)
    }
  }

  return bytes
}

export default function serialize(value: Value) {
  const bytes: number[] = []

  for (const block of value.document.nodes.toArray()) {
    switch (block.type) {
    case 'paragraph':
      frame(bytes, FRAME_PARA, textBlock(block))
      break

    default:
      throw new Error(`invalid block: ${block.toJS()}`)
    }
  }

  const result: number[] = []
  frame(result, FRAME_MESSAGE, bytes)
  return new Uint8Array(result)
}
