import './background-listener'
import './shortcuts'
import $background from './background-listener'

console.debug('[obsidian-web-clipper]: Loaded')

$background.message.actionListener('error').subscribe(({ message, respond }) => {
  console.warn('[obsidian-web-clipper:error]', message)
  const finalMessage = typeof message === 'string' ? message : message?.data?.message
  if (finalMessage) {
    alert(`[Obsidian Web Clipper] ${finalMessage}`)
  }
  respond()
})
