/// <reference path="../../../node_modules/@types/firefox-webext-browser/index.d.ts"/>

import {Component} from '@angular/core';
import {BrowserService, ExportMessage} from "./browser.service";
import {ObsidianService} from "./obsidian.service";
import {OperatorFunction, Subject} from "rxjs";
import {filter, map, switchMap} from "rxjs/operators";
import {MercuryService} from "./mercury.service";
import {MarkdownService} from "./markdown.service";

type Tab = browser.tabs.Tab;

@Component({
  selector: 'app-background',
  template: ``,
  styles: []
})
export class BackgroundComponent {
  constructor(browserService: BrowserService, obsidianService: ObsidianService, mercuryService: MercuryService, markdownService: MarkdownService) {
    const exportMessage$ = new Subject<ExportMessage>()
    exportMessage$.pipe(
      switchMap(({data}) => mercuryService.parse(data.url, {html: data.html})),
      switchMap((result) => browser.storage.local.get(['vault', 'path']).then(res => ({config: res, ...result}))),
      switchMap((result) => markdownService.convert(result.content ?? '').pipe(map(markdown => ({
        ...result,
        content: markdown
      })))),
      switchMap(({
                   title,
                   content,
                   config
                 }) => obsidianService.new(config.vault, `${config.path}/${title}`, content ?? '')
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
