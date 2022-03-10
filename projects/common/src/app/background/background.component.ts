import {Component} from '@angular/core';
import {BrowserService} from "./browser.service";
import {ObsidianService} from "./obsidian.service";
import {catchError, combineLatestWith, throwError} from "rxjs";
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
  constructor(
    browserService: BrowserService,
    obsidianService: ObsidianService,
    markdownService: MarkdownService,
    articleParserService: ArticleParserService
  ) {
    browserService.message.actionListener('export').pipe(
      switchMap(({message: {document, url, selection, path = ''}, sender}) =>
        articleParserService.extract({document, url, selection}).pipe(
          map(({title, content}) => ({title: title ?? '', content: markdownService.convert(content ?? ''), path})),
          combineLatestWith(browser.storage.local.get('vault')),
          map(([{title, content, path}, {vault}]) => ({name: `${path}/${filenamify(title)}`, content, vault})),
          switchMap((data) => obsidianService.api('new', data).pipe(
            map(url => obsidianService.plusToSpace(url.toString())),
          )),
          switchMap(url => browserService.tab.create({url}).pipe(
            map(({id}) => id),
            filter((id): id is number => !!id),
            switchMap(id => browserService.tab.warmup(id)),
            switchMap(id => browser.tabs.remove(id))
          )),
          catchError((err) => {
            browserService.message.action(sender.tab!.id!, 'error', Object.create(err))
            return throwError(() => err)
          })
        )
      )
    ).subscribe()
  }
}
