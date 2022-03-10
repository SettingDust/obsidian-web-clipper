import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, Validators} from "@angular/forms";
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
      paths: this.fb.array([
        this.fb.group({
          hotkey: this.fb.control('m o', [Validators.required]),
          path: this.fb.control('Memo', [Validators.required])
        }),
        this.fb.group({
          hotkey: this.fb.control('r l', [Validators.required]),
          path: this.fb.control('ReadLater', [Validators.required])
        })
      ])
    }
  )

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    from(browser.storage.local.get()).pipe(
      tap(res => this.form.patchValue(res)),
      switchMap(() => this.form.valueChanges),
      tap(value => value.paths = value.paths.filter((it: { hotkey: string, path: string }) => !!it?.hotkey)),
      tap(value => console.debug(`[obsidian-web-clipper] Options changed`, value)),
      switchMap(value => browser.storage.local.set(value))
    ).subscribe()
  }

  get paths() {
    return this.form.get('paths') as FormArray;
  }

  addPath() {
    this.paths.push(this.fb.group({
      hotkeys: this.fb.control('', [Validators.required]),
      path: this.fb.control('', [Validators.required])
    }))
  }
}
