import { SchemaProperties } from "slate"

export type MediaTextOptions = {
  inlines?: string[]
}

export default function schema({ inlines = [] }: MediaTextOptions): SchemaProperties {
  return {
    blocks: {
      media_text: {
        nodes: [{
          match: [
            ...inlines.map(type => ({ type })),
            { object: 'text' },
          ],
        }],
        marks: [],
      },
    },
  }
}
