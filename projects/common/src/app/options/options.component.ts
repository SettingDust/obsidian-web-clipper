import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {switchMap, tap} from "rxjs/operators";
import {from} from 'rxjs';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent implements OnInit {
  form = this.fb.group(
    {
      vault: this.fb.control('', [Validators.required]),
      path: this.fb.control('Webpage', [Validators.required]),
    }
  )

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    // browser.storage.local.get("obsidianWebClipperOptions").then(res => this.form.patchValue(res))
    // this.form.valueChanges.pipe(
    //   tap(value => console.debug(`[obsidian-web-clipper] Options changed`, value))
    // )
    from(browser.storage.local.get()).pipe(
      tap(res => this.form.patchValue(res)),
      switchMap(() => this.form.valueChanges),
      tap(value => console.debug(`[obsidian-web-clipper] Options changed`, value)),
      switchMap(value => browser.storage.local.set(value))
    ).subscribe()
  }
}
