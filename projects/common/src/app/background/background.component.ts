import {Component} from '@angular/core';
import {BrowserService, ExportMessage} from "./browser.service";
import {ObsidianService} from "./obsidian.service";
import {OperatorFunction, Subject, tap} from "rxjs";
import {filter, map, switchMap} from "rxjs/operators";
import {MarkdownService} from "./markdown.service";
import filenamify from "filenamify";
import {extract} from "article-parser"

type Tab = browser.tabs.Tab;

@Component({
  selector: 'app-background',
  template: ``,
  styles: []
})
export class BackgroundComponent {
  constructor(browserService: BrowserService, obsidianService: ObsidianService, markdownService: MarkdownService) {
    const exportMessage$ = new Subject<ExportMessage>()

    browserService.command("export").pipe(
      switchMap(() => browser.tabs.query({active: true})),
      map((tabs) => tabs[0].id),
      filter((id) => !!id) as OperatorFunction<number | undefined, number>,
      switchMap((id) => browser.tabs.sendMessage(id, {action: 'export'}) as Promise<ExportMessage>)
    ).subscribe(res => exportMessage$.next(res))

    exportMessage$.pipe(
      switchMap(({data}) => extract(data.document).then(result => ({
        ...result,
        selection: data.selection || null
      }))),
      switchMap((result) => browser.storage.local.get(['vault', 'path']).then(res => ({config: res, ...result}))),
      map((result) => ({
        ...result,
        content: markdownService.convert(result.selection ?? result.content ?? '')
      })),
      tap(({
             title,
             content,
             config
           }) => {
        console.debug(`[obsidian-web-clipper] Trying to new`, {
          title,
          content,
          config
        })
      }),
      switchMap(
        ({
           title,
           content,
           config
         }) => obsidianService.new(config.vault, `${config.path}/${filenamify(title ?? '')}`, content ?? '')
      ),
      filter(({id}) => !!id),
      map(({id}) => id) as OperatorFunction<Tab, number>,
      // switchMap(id => browser.tabs.remove(id))
    ).subscribe()
  }
}
