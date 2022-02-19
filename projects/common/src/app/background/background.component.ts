import {Component} from '@angular/core';
import {BrowserService,} from "./browser.service";
import {ObsidianService} from "./obsidian.service";
import {combineLatest, from, mapTo, of} from "rxjs";
import {filter, map, switchMap, tap} from "rxjs/operators";
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
    combineLatest([
      browserService.command("export").pipe(
        switchMap(() => browser.tabs.query({active: true})),
        map(tabs => tabs[0].id),
        filter((id): id is number => !!id),
      ),
      of('export')
    ]).pipe(
      switchMap((arg) => browserService.action(arg as [number, 'export'])),
      switchMap(({data}) => combineLatest([
        articleParserService.extract(data).pipe(
          tap(data => data.content = markdownService.convert(data.content ?? ''))
        ),
        browser.storage.local.get(['vault', 'path'])
      ])),
      map(([{title, content}, {vault, path}]) => ({title: title ?? '', content, vault: vault ?? '', path: path ?? ''})),
      switchMap(({title, content, vault, path}) => obsidianService.new(vault, `${path}/${filenamify(title)}`, content)),
      map(({id}) => id),
      filter((id): id is number => !!id),
      switchMap((id) => from(browser.tabs.warmup(id)).pipe(mapTo(id))),
      switchMap(id => browser.tabs.remove(id))
    ).subscribe()
  }
}
