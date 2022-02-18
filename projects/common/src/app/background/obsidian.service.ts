import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ObsidianService {
  private BASE_URL = "obsidian://"

  private api = (path: string) => new URL(`${this.BASE_URL}${path}`)

  new(vault: string, file: string, content?: string, silent: boolean = false) {
    const url = this.api("new")
    const searchParams = url.searchParams;
    searchParams.append("vault", vault)
    searchParams.append("file", file)
    if (content) searchParams.append("content", content)
    if (silent) searchParams.append("silent", String(silent))
    return browser.tabs.create({url: url.toString().replace(/\+/g, '%20'), active: false})
  }
}
