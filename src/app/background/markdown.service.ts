import { Injectable } from '@angular/core'
import { NodeHtmlMarkdown } from 'node-html-markdown'

@Injectable({
  providedIn: 'root'
})
export class MarkdownService {
  convert = (html: string) => NodeHtmlMarkdown.translate(html)
}
