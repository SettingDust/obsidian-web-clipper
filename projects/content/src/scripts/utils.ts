export function getSelectionHtml() {
  let html = undefined;
  const sel = window.getSelection();
  if (sel?.rangeCount) {
    const container = document.createElement("div");
    for (let i = 0; i < sel.rangeCount; ++i) {
      container.appendChild(sel.getRangeAt(i).cloneContents());
    }
    html = container.innerHTML;
  }
  return html;
}
