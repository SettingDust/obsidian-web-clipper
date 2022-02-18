import {Injectable} from '@angular/core';
import {extract} from 'article-parser';

@Injectable({
  providedIn: 'root'
})
export class ArticleParserService {

  constructor() {
  }

  extract = (input: string) => extract(input)
}
