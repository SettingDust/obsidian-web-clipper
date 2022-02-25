import {Component} from '@angular/core';
import {BrowserService} from "./browser.service";
import {ObsidianService} from "./obsidian.service";
import {catchError, combineLatest, of} from "rxjs";
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
    browserService.command("export").pipe(
      switchMap(() => browser.tabs.query({active: true}).then(tabs => tabs[0].id)),
      filter((id): id is number => !!id),
      switchMap(id => browserService.action(id, 'export').pipe(
        switchMap(({data}) => combineLatest([
          articleParserService.extract(data!).pipe(
            tap(data => data.content = markdownService.convert(data.content ?? ''))
          ),
          browser.storage.local.get(['vault', 'path'])
        ]).pipe(
          map(([{title, content}, {vault, path}]) => ({
            title: title ?? '',
            content,
            vault: vault ?? '',
            path: path ?? ''
          })),
          map(({title, content, vault, path}) => ({name: `${path}/${filenamify(title)}`, content, vault}))
        )),
        switchMap((data) => obsidianService.api('new', data).pipe(
          map(url => obsidianService.plusToSpace(url.toString())),
        )),
        switchMap(url => browserService.tab.create({url}).pipe(
          map(({id}) => id),
          filter((id): id is number => !!id),
          switchMap(id => browserService.tab.warmup(id)),
          switchMap(id => browser.tabs.remove(id))
        )),
        catchError((err, caught) => {
          browserService.action(id, 'error', Object.create(err))
          return of({err, caught})
        })
      ))
    ).subscribe()
  }
}
