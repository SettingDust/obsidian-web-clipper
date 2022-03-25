import { Component, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { from } from 'rxjs'
import { switchMap, tap } from 'rxjs/operators'

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {
  form = this.fb.group({
    vault: this.fb.control('')
  })

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    from(browser.storage.local.get())
      .pipe(
        tap((it) => this.form.patchValue(it)),
        switchMap(() => this.form.valueChanges.pipe(switchMap((value) => browser.storage.local.set(value))))
      )
      .subscribe()
  }
}
