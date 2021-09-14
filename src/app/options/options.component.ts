import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {fromPromise} from "rxjs/internal-compatibility";
import {switchMap, tap} from "rxjs/operators";

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
    fromPromise(browser.storage.local.get()).pipe(
      tap(res => this.form.patchValue(res)),
      switchMap(() => this.form.valueChanges),
    ).subscribe(value => browser.storage.local.set(value).then())
  }
}
