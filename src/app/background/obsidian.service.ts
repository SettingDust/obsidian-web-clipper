import {Injectable} from '@angular/core';
import {fromPromise} from "rxjs/internal-compatibility";
import {BackgroundModule} from "./background.module";

@Injectable({
  providedIn: BackgroundModule
})
export class ObsidianService {

  new = (vault: string, file: string, content?: string, silent: boolean = false) => {
    const query = []
    query.push(`vault=${encodeURIComponent(vault)}`)
    query.push(`file=${encodeURIComponent(file)}`)
    if (content) query.push(`content=${encodeURIComponent(content)}`)
    if (silent) query.push(`silent`)
    return fromPromise(browser.tabs.create({url: `obsidian://new?${query.join('&')}`, active: false}))
  }
}
