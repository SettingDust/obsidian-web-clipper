import {Component, ViewEncapsulation} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, Validators} from '@angular/forms';
import {concat, from, of} from 'rxjs';
import {map, switchMap, tap} from 'rxjs/operators';
import {I18nPipe} from '../../i18n.pipe';

@Component({
  selector: 'app-shortcuts',
  templateUrl: './shortcuts.component.html',
  styleUrls: ['./shortcuts.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ShortcutsComponent {
  required = ['hotkey']
  form = this.fb.group({
    shortcuts: this.fb.array([])
  })
  actions: string[] = []

  constructor(private fb: FormBuilder) {
    from(browser.storage.local.get('shortcuts')).pipe(
      map(it => it.shortcuts as [{ shortcut: string, action: string } & any]),
      switchMap(it => from(it).pipe(
        tap((data) => {
          if (!this.actions.includes(data.action)) this.actions.push(data.action)
          this.addShortcut(data)
        }),
      )),
      switchMap(() => this.form.valueChanges.pipe(
        map(it => it.shortcuts.filter((obj: { shortcut: any; }) => obj.shortcut)),
        switchMap(value => browser.storage.local.set({shortcuts: value}))
      ))
    ).subscribe()
  }

  get shortcuts() {
    return this.form.get('shortcuts') as FormArray
  }

  addShortcut(data: { shortcut: string, action: string } & any = {shortcut: '', action: 'option'}) {
    const controls = Object.entries(data).reduce((prev, [key, value]) => {
      prev[key] = this.fb.control(value)
      if (!this.required.includes(key)) prev[key].setValidators(Validators.required)
      return prev
    }, {} as { [key: string]: AbstractControl })
    this.shortcuts.push(this.fb.group(controls))
  }

  $shortcutChange = (shortcut: AbstractControl) => concat(
    of(shortcut.get('action')?.value),
    from(shortcut.get('action')?.valueChanges ?? '')
  )
}
