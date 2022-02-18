import {Component} from '@angular/core';
import {BrowserService, ExportMessage} from "./browser.service";
import {ObsidianService} from "./obsidian.service";
import {OperatorFunction, Subject} from "rxjs";
import {filter, map, switchMap} from "rxjs/operators";
import {MarkdownService} from "./markdown.service";
import filenamify from "filenamify";
import {ArticleParserService} from './article-parser.service';

@Component({
  selector: 'app-background',
  template: ``,
  styles: []
})
export class BackgroundComponent {
  constructor(browserService: BrowserService, obsidianService: ObsidianService, markdownService: MarkdownService, articleParserService: ArticleParserService) {
    const exportMessage$ = new Subject<ExportMessage>()

    browserService.command("export").pipe(
      switchMap(() => browser.tabs.query({active: true})),
      map((tabs) => tabs[0].id),
      filter((id) => !!id) as OperatorFunction<number | undefined, number>,
      switchMap((id) => browser.tabs.sendMessage(id, {action: 'export'}) as Promise<ExportMessage>)
    ).subscribe(res => exportMessage$.next(res))

    exportMessage$.pipe(
      switchMap(({data}) => articleParserService.extract(data.document).then(result => ({
        ...result,
        selection: data.selection || null
      }))),
      switchMap((result) => browser.storage.local.get(['vault', 'path']).then(res => ({config: res, ...result}))),
      map((result) => ({
        ...result,
        content: markdownService.convert(result.selection ?? result.content ?? '')
      })),
      switchMap(
        ({
           title,
           content,
           config
         }) => obsidianService.new(config.vault, `${config.path}/${filenamify(title ?? '')}`, content ?? '')
      ),
      filter(({id}) => !!id),
      switchMap(({id}) => browser.tabs.warmup(id!).then(() => browser.tabs.remove(id!)))
    ).subscribe()
  }
}
