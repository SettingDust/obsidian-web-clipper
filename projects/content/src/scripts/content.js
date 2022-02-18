browser.runtime.onMessage.addListener((message, sender, respond) => {
  switch (message.action) {
    case 'export':
      respond({
        action: 'export',
        data: {
          document: document.documentElement.outerHTML,
          url: window.location.href,
          selection: getSelectionHtml()
        }
      })
      return true
    default:
      return false
  }
})

function getSelectionHtml() {
  let html = null;
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
