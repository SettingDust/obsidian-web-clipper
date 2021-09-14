/// <reference path="../../../node_modules/@types/firefox-webext-browser/index.d.ts"/>

import {Component} from '@angular/core';
import {BrowserService, ExportMessage} from "./browser.service";
import {ObsidianService} from "./obsidian.service";
import {OperatorFunction, Subject} from "rxjs";
import {filter, map, switchMap} from "rxjs/operators";

type Tab = browser.tabs.Tab;

@Component({
  selector: 'app-background',
  template: ``,
  styles: []
})
export class BackgroundComponent {
  constructor(browserService: BrowserService, obsidianService: ObsidianService) {
    const exportMessage$ = new Subject<ExportMessage>()
    exportMessage$.pipe(
      switchMap(async (message) =>
        ({...await browser.storage.local.get(['vault', 'path']), ...message})
      ) as OperatorFunction<ExportMessage, ExportMessage & { vault: string, path: string }>,
      switchMap(({data, vault, path}) => obsidianService.new(vault, `${path}/${data.title}`, data.content)),
      filter(({id}) => !!id),
      map(({id}) => id) as OperatorFunction<Tab, number>,
      switchMap(id => browser.tabs.remove(id))
    ).subscribe()

    browserService.command("export").pipe(
      switchMap(() => browser.tabs.query({active: true})),
      map((tabs) => tabs[0].id),
      filter((id) => id !== undefined) as OperatorFunction<number | undefined, number>,
      switchMap((id) => browser.tabs.sendMessage(id, {action: 'export'}) as Promise<ExportMessage>)
    ).subscribe(res => exportMessage$.next(res))
  }
}
