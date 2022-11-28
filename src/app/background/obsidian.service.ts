import { Injectable } from '@angular/core'
import { ExtensionService } from '../extension.service'
import { filter, map, retry, switchMap } from 'rxjs/operators'
import { Options, OptionService } from '../option.service'
import { catchError, merge, Observable, throwError } from 'rxjs'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class ObsidianService {
  private BASE_URL_SCHEMA = 'obsidian://'
  private api?: Options['api']

  constructor(
    private browserService: ExtensionService,
    private options: OptionService,
    private httpClient: HttpClient
  ) {
    merge(options.get('api'), options.onChange.pipe(map((it) => it.api))).subscribe((it) => (this.api = it))
  }

  /**
   * Fetch the REST server status
   */
  status = () =>
    this.request<{ authenticated: boolean }>().pipe(
      catchError((err) => this.open().pipe(() => throwError(() => err))),
      retry(3)
    )

  create = (filename: string, content?: string) =>
    this.request(`vault/${filename}`, 'put', {
      headers: {
        'Content-Type': 'text/markdown'
      },
      body: content
    })

  /**
   * Open the Obsidian using url scheme
   */
  open = () =>
    this.browserService.tab.create({ url: `${this.BASE_URL_SCHEMA}/` }).pipe(
      map(({ id }) => id),
      filter((id): id is number => !!id),
      switchMap((id) => this.browserService.tab.warmup(id)),
      switchMap((id) => browser.tabs.remove(id))
    )

  private header = () => ({
    Authorization: `Bearer ${this.api?.token}`
  })

  private request = <Response = Object, Body = undefined>(
    path: string = '',
    method: 'get' | 'post' | 'put' | 'delete' | 'patch' = 'get',
    options: {
      body?: Body
      headers?: {
        [header: string]: string | string[]
      }
    } = {}
  ) => <Observable<Response>>this.httpClient.request(method, `${this.api!.url}${path}`, {
      ...options,
      headers: {
        ...this.header(),
        ...options.headers
      }
    })
}
