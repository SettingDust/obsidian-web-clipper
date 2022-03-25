export function getSelectionHtml() {
  const sel = window.getSelection()
  if (sel?.rangeCount) {
    const container = document.createElement('div')
    for (let i = 0; i < sel.rangeCount; ++i) {
      container.appendChild(sel.getRangeAt(i).cloneContents())
    }
    return container.innerHTML?.length ? container.innerHTML : undefined
  }
  return undefined
}
