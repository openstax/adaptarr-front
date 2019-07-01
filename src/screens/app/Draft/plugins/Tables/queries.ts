import { Editor } from 'slate'

export function getCounterDefinitions(editor: Editor, definitions: object[]) {
  definitions.push({
    table: {
      table: 'enter',
    },
  })
}
