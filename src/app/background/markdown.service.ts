import { Injectable } from '@angular/core'
import { NodeHtmlMarkdown } from 'node-html-markdown'

@Injectable({
  providedIn: 'root'
})
export class MarkdownService {
  convert = (html: string) => {
    const content = NodeHtmlMarkdown.translate(html, {
      preferNativeParser: true,
      textReplace: [[/</g, '\\<']]
    })
    console.debug('[markdown]:', content)
    return content
  }
}
