import { Component } from '@angular/core'
import { ExtensionService } from '../extension.service'
import { ObsidianService } from './obsidian.service'
import { catchError, of, throwError } from 'rxjs'
import { map, switchMap, tap } from 'rxjs/operators'
import { MarkdownService } from './markdown.service'
import filenamify from 'filenamify'
import { ArticleExtractorService } from '../article-extractor.service'
import { ExportTemplateService } from '../export-template.service'
import { i18n } from '../i18n.pipe'

@Component({
  selector: 'app-background',
  template: ``,
  styles: []
})
export class BackgroundComponent {
  constructor(
    extensionService: ExtensionService,
    obsidianService: ObsidianService,
    markdownService: MarkdownService,
    articleParserService: ArticleExtractorService,
    templateService: ExportTemplateService
  ) {
    extensionService.message
      .onAction('export')
      .pipe(
        tap((it) => console.debug('[action:export]:', it.message)),
        switchMap(({ message: { document, url: inputUrl, selection, path = '' }, sender }) =>
          obsidianService.status().pipe(
            catchError(() => throwError(() => new Error(i18n('errorNoServer')))),
            switchMap((it) => {
              return it.authenticated ? of(true) : throwError(() => new Error(i18n('errorNoToken')))
            }),
            switchMap(() =>
              articleParserService.extract({ document, url: inputUrl, selection }).pipe(
                map((data) => (data.content ? { ...data, content: markdownService.convert(data.content) } : data)),
                switchMap((data) =>
                  templateService.get(data.url).pipe(
                    switchMap((template) => {
                      const finalPath = `${path}/${filenamify(data.title)}.md`
                      console.debug('[obsidian:create:path]', finalPath)
                      return obsidianService.create(
                        finalPath,
                        data.content ? templateService.render(template, data) : undefined
                      )
                    })
                  )
                )
              )
            ),
            catchError((error: unknown) => {
              if (sender?.tab?.id) extensionService.message.action(sender.tab.id, 'error', error)
              console.warn(error)
              return of(null)
            })
          )
        )
      )
      .subscribe()

    extensionService.message.onAction('option').subscribe((data) => {
      console.debug('[action:option]')
      data.respond()
      return browser.tabs.create({
        url: browser.runtime.getURL('index.html?#/(options:rules)'),
        active: true
      })
    })
  }
}
