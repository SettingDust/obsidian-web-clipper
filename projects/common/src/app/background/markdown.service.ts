import {Injectable} from '@angular/core';
import TurndownService from "turndown";

@Injectable({
  providedIn: 'root'
})
export class MarkdownService {
  private turndownService = new TurndownService()

  convert = (html: string | TurndownService.Node) =>
    Promise.resolve(this.turndownService.turndown(html))
}
