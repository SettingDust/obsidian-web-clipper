browser.runtime.onMessage.addListener((message, sender, respond) => {
  switch (message.action) {
    case 'export':
      respond({
        action: 'export',
        data: {html: document.documentElement.innerHTML, url: window.location.href}
      })
      return true
  }
})

