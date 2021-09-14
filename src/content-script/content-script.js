const turndown = new TurndownService()

const mercury = Mercury

browser.runtime.onMessage.addListener((message, sender, respond) => {
  switch (message.action) {
    case 'export':
      mercury.parse().then(result => {
        console.log(`[Test] ${result.title}`)
        respond({
          action: 'export',
          data: {title: result.title, content: turndown.turndown(result. content), lead_image_url: result.lead_image_url}
        })
      })
      return true
  }
})

