import { Document, Editor, Inline, Value } from "slate"

export const getActiveHighlight = (editor: Editor, value: Value) => {
  const { document, selection: { start } } = value

  if (!start.path) return null

  let node: Document | Inline = document
  for (const index of start.path as unknown as Iterable<number>) {
    node = node.nodes.get(Number(index)) as Inline

    if (node.type === 'highlight') {
      return node
    }
  }

  return null
}
