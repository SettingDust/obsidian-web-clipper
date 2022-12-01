import { Component } from '@angular/core'
import { AbstractControl, UntypedFormArray, UntypedFormBuilder, Validators } from '@angular/forms'
import { concat, from, of } from 'rxjs'
import { map, switchMap, tap } from 'rxjs/operators'

@Component({
  selector: 'app-shortcuts',
  templateUrl: './shortcuts.component.html',
  styleUrls: ['./shortcuts.component.scss']
})
export class ShortcutsComponent {
  form = this.fb.group({
    shortcuts: this.fb.array([])
  })
  actions: string[] = []

  constructor(private fb: UntypedFormBuilder) {
    from(browser.storage.local.get('shortcuts'))
      .pipe(
        map((it) => it.shortcuts as [{ shortcut: string; action: string } & unknown]),
        tap((it) => this.form.setControl('shortcuts', this.fb.array(it.map((data) => this.fb.group(data))))),
        switchMap((it) =>
          from(it).pipe(
            tap((data) => {
              if (!this.actions.includes(data.action)) this.actions.push(data.action)
            })
          )
        ),
        switchMap(() =>
          this.form.valueChanges.pipe(
            map((it) => it.shortcuts.filter((object: { shortcut: unknown }) => object.shortcut)),
            switchMap((value) => browser.storage.local.set({ shortcuts: value }))
          )
        )
      )
      .subscribe()
  }

  get shortcuts() {
    return this.form.get('shortcuts') as UntypedFormArray
  }

  addShortcut(data?: { shortcut: string; action: string } & unknown) {
    this.shortcuts.push(this.fb.group(this.shortcutToForm({ shortcut: '', action: 'option', ...data })))
  }

  shortcutToForm = (data: { shortcut: string; action: string } & unknown) =>
    this.fb.group({
      shortcut: [data.shortcut, Validators.required],
      action: [data.action]
    })

  $shortcutChange = (shortcut: AbstractControl) =>
    concat(of(shortcut.get('action')?.value), from(shortcut.get('action')?.valueChanges ?? ''))
}
