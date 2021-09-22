/// <reference path="../../../node_modules/@types/firefox-webext-browser/index.d.ts"/>

import {Component} from '@angular/core';
import {BrowserService, ExportMessage} from "./browser.service";
import {ObsidianService} from "./obsidian.service";
import {OperatorFunction, Subject} from "rxjs";
import {filter, map, switchMap} from "rxjs/operators";
import {MarkdownService} from "./markdown.service";
import {ArticleParserService} from './article-parser.service';
import filenamify from "filenamify";

type Tab = browser.tabs.Tab;

@Component({
  selector: 'app-background',
  template: ``,
  styles: []
})
export class BackgroundComponent {
  constructor(browserService: BrowserService, obsidianService: ObsidianService, articleParserService: ArticleParserService, markdownService: MarkdownService) {
    const exportMessage$ = new Subject<ExportMessage>()
    exportMessage$.pipe(
      switchMap(({data}) => articleParserService.parse(data.url, data.document).then(result => ({
        ...result,
        selection: data.selection?.length ? data.selection : null
      }))),
      switchMap((result) => browser.storage.local.get(['vault', 'path']).then(res => ({config: res, ...result}))),
      switchMap((result) => markdownService.convert(result.selection ?? result.content ?? '')
        .then(markdown => ({
          ...result,
          content: markdown
        }))),
      switchMap(
        ({
           title,
           content,
           config
         }) => obsidianService.new(config.vault, `${config.path}/${filenamify(title ?? '')}`, content ?? '')
      ),
      filter(({id}) => !!id),
      map(({id}) => id) as OperatorFunction<Tab, number>,
      switchMap(id => browser.tabs.remove(id))
    ).subscribe()

    browserService.command("export").pipe(
      switchMap(() => browser.tabs.query({active: true})),
      map((tabs) => tabs[0].id),
      filter((id) => !!id) as OperatorFunction<number | undefined, number>,
      switchMap((id) => browser.tabs.sendMessage(id, {action: 'export'}) as Promise<ExportMessage>)
    ).subscribe(res => exportMessage$.next(res))
  }
}
