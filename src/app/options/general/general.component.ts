import { Component } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { EMPTY } from 'rxjs'
import { switchMap, tap } from 'rxjs/operators'
import { OptionService } from '../../option.service'
import { i18n } from '../../i18n.pipe'

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent {
  form = this.fb.group({
    url: this.fb.control('', Validators.required),
    token: this.fb.control('', Validators.required)
  })

  constructor(private fb: FormBuilder, private optionService: OptionService) {
    this.optionService
      .get('api')
      .pipe(
        tap((it) => this.form.patchValue(it)),
        switchMap(() =>
          this.form.valueChanges.pipe(
            switchMap((value) =>
              value.url && value.token
                ? this.optionService.set({
                    api: {
                      url: value.url,
                      token: value.token
                    }
                  })
                : EMPTY
            )
          )
        )
      )
      .subscribe()
  }

  request() {
    if (this.form.get('url')?.value) {
      // Remove all origins permission
      browser.permissions.getAll().then((it) => browser.permissions.remove({ origins: it.origins }))
      browser.permissions
        .request({
          origins: [`${this.form.get('url')?.value}*`]
        })
        .then((it) => {
          if (!it) throw new Error(i18n('errorNoPermission'))
        })
    }
  }
}
