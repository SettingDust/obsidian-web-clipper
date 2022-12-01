export function getSelectionHtml() {
  const sel = window.getSelection()
  if (sel?.rangeCount) {
    const container = document.createElement('div')
    for (let index = 0; index < sel.rangeCount; ++index) {
      container.append(sel.getRangeAt(index).cloneContents())
    }
    return container.innerHTML?.length ? container.innerHTML : undefined
  }
  return
}
