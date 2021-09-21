import {Injectable} from '@angular/core';
import * as Mercury from "@postlight/mercury-parser";
import {ParseOptions} from "@postlight/mercury-parser";
import {fromPromise} from "rxjs/internal-compatibility";

@Injectable({
  providedIn: 'root'
})
export class MercuryService {
  parse = (url: string, options?: ParseOptions) => fromPromise(Mercury.parse(url, options))
}
