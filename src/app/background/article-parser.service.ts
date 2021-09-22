import {Injectable} from '@angular/core';
import {extract} from "article-parser";

@Injectable({
  providedIn: 'root'
})
export class ArticleParserService {
  parse = (url: string, html: string) => extract(url, html)
}
