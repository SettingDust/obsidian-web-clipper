import { Component } from '@angular/core'
import { BrowserService } from '../browser.service'
import { ObsidianService } from './obsidian.service'
import { catchError, combineLatestWith, from, throwError } from 'rxjs'
import { filter, map, switchMap } from 'rxjs/operators'
import { MarkdownService } from './markdown.service'
import filenamify from 'filenamify'
import { ArticleExtractorService } from '../article-extractor.service'
import { I18nPipe } from '../i18n.pipe'
import { ExportTemplateService } from '../export-template.service'

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
    articleParserService: ArticleExtractorService,
    templateService: ExportTemplateService,
    i18n: I18nPipe
  ) {
    // TODO Action types
    from(
      browser.storage.local.get({
        vault: '',
        shortcuts: [
          {
            shortcut: 'Alt+o Alt+p',
            action: 'option'
          },
          {
            shortcut: 'Alt+r Alt+l',
            action: 'export',
            path: i18n.transform('optionShortcutReadLater')
          },
          {
            shortcut: 'Alt+m Alt+o',
            action: 'export',
            path: i18n.transform('optionShortcutMemo')
          }
        ],
        rules: [
          {
            patterns: ['*://foo.bar/*', '*://exam.ple/*'],
            selector: '#Article',
            unwanted: ['.foo', '.bar']
          }
        ]
      })
    ).subscribe((it) => browser.storage.local.set(it).then())

    browserService.message
      .actionListener('export')
      .pipe(
        switchMap(({ message: { document, url: rawUrl, selection, path = '' }, sender }) =>
          articleParserService.extract({ document, url: rawUrl, selection }).pipe(
            map(({ title, content, url }) => ({
              title: title ?? '',
              content: markdownService.convert(selection ?? content ?? ''),
              path,
              url: url ?? rawUrl
            })),
            switchMap(({ title, content, path, url }) => templateService.get(url).pipe(
              map((template) => ({
                title,
                path,
                content: templateService.render(template, { title, url, content })
              }))
            )),
            combineLatestWith(browser.storage.local.get('vault')),
            map(([{ title, content, path }, { vault }]) => ({
              name: `${path}/${filenamify(title)}`,
              content,
              vault: vault ?? ''
            })),
            switchMap((data) =>
              obsidianService.api('new', data).pipe(map((url) => obsidianService.plusToSpace(url.toString())))
            ),
            switchMap((url) =>
              browserService.tab.create({ url }).pipe(
                map(({ id }) => id),
                filter((id): id is number => !!id),
                switchMap((id) => browserService.tab.warmup(id)),
                switchMap((id) => browser.tabs.remove(id))
              )
            ),
            catchError((err) => {
              browserService.message.action(sender.tab!.id!, 'error', Object.create(err))
              return throwError(() => err)
            })
          )
        )
      )
      .subscribe()

    browserService.message.actionListener('option').subscribe(() =>
      browser.tabs.create({
        url: browser.runtime.getURL('index.html?#/options/(options:rules)'),
        active: true
      })
    )
  }
}
