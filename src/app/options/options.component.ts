import {AfterViewInit, Component} from '@angular/core';
import {FormArray, FormBuilder, Validators} from "@angular/forms";
import {switchMap, tap} from "rxjs/operators";
import {from} from 'rxjs';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent implements AfterViewInit {
  form = this.fb.group({
    vault: this.fb.control(''),
    paths: this.fb.array([])
  })

  constructor(private fb: FormBuilder) {
  }

  ngAfterViewInit(): void {
    from(browser.storage.local.get()).pipe(
      tap(res => {
        this.form.patchValue({vault: res.vault})
        res.paths.forEach((it: { hotkey: string; path: string; }) => this.addPath(it))
      }),
      switchMap(() => this.form.valueChanges.pipe(
        tap(value => {
          value.paths = value.paths.filter((it: { hotkey: string, path: string }) => !!it?.hotkey)
          console.debug(`[obsidian-web-clipper] Options changed`, value)
        }),
        switchMap(value => browser.storage.local.set(value))
      ))
    ).subscribe()
  }

  get paths() {
    return this.form.get('paths') as FormArray;
  }

  addPath({hotkey, path} = {hotkey: '', path: ''}) {
    this.paths.push(this.fb.group({
      hotkey: this.fb.control(hotkey, [Validators.required]),
      path: this.fb.control(path)
    }))
  }
}
