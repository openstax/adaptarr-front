import { Editor } from "slate"

export function onClick(event: React.MouseEvent, editor: Editor, next: () => void) {
  const target = event.target as HTMLElement
  if (target.classList.contains('footnote')) {
    const key = target.dataset.key as string
    editor.moveTo(key, 0)
  } else {
    return next()
  }
}

export function onKeyDown(event: React.KeyboardEvent, editor: Editor, next: () => void) {
  const inl = editor.value.startInline
  if (!inl || inl.type !== 'footnote') return next()

  const isCollapsed = inl.data.get('collapse')
  if (!isCollapsed) return next()

  switch (event.key) {
  case 'ArrowLeft':
      editor.moveToStartOfInline()
      return true

  case 'ArrowRight':
      editor.moveToEndOfInline()
      return true

  default:
      return next()
  }
}
