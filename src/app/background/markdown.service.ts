import { Injectable } from '@angular/core'
import TurndownService from 'turndown'
import { gfm } from '@guyplusplus/turndown-plugin-gfm'

@Injectable({
  providedIn: 'root'
})
export class MarkdownService {
  private turndownService = new TurndownService()

  constructor() {
    gfm(this.turndownService)
  }

  convert = (html: string | TurndownService.Node) => this.turndownService.turndown(html)
}
