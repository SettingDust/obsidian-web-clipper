import {Injectable} from '@angular/core';
import TurndownService from "turndown";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MarkdownService {
  private turndownService = new TurndownService()

  convert = (html: string | TurndownService.Node) =>
    new Observable<string>(subscriber => subscriber.next(this.turndownService.turndown(html)))
}
