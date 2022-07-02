import { Component, OnInit } from '@angular/core'
import { from, pluck } from 'rxjs'
import { BrowserService } from '../../browser.service'
import { AbstractControl, FormArray, FormBuilder } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { map, switchMap } from 'rxjs/operators'
import { Rule } from 'src/app/rule.service'
import defaultTemplate from '../../../assets/default.template'
import { ExportTemplateService } from '../../export-template.service'

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit {
  form = this.fb.group({
    rules: this.fb.array<Rule>([])
  })

  constructor(
    private browserService: BrowserService,
    private fb: FormBuilder,
    private templateService: ExportTemplateService,
    route: ActivatedRoute
  ) {
    // TODO 符合 url 的规则排在上面
  }

  get rules() {
    return this.form.get('rules') as FormArray
  }

  patterns(rule: AbstractControl) {
    return rule.get('patterns') as FormArray
  }

  unwanted = (rule: AbstractControl) => rule.get('unwanted') as FormArray

  addRule(
    data: Rule = { patterns: [''], template: this.templateService.defaultTemplate }
  ) {
    this.rules.insert(0, this.ruleToForm(data))
  }

  addPattern(patterns: FormArray) {
    patterns.push(this.fb.control(''))
  }

  addUnwanted(unwanted: FormArray) {
    unwanted.push(this.fb.control(''))
  }

  ruleToForm = (data: Rule) =>
    this.fb.group({
      patterns:
        data.patterns
          ?.map((it) => this.fb.control(it))
          .reduce((prev, curr) => {
            prev.push(curr)
            return prev
          }, this.fb.array([])) ?? this.fb.array([]),
      selector: this.fb.control(data.selector),
      unwanted:
        data.unwanted
          ?.map((it) => this.fb.control(it))
          .reduce((prev, curr) => {
            prev.push(curr)
            return prev
          }, this.fb.array([])) ?? this.fb.array([]),
      template: this.fb.control(data.template)
    })

  ngOnInit(): void {
    from(browser.storage.local.get('rules')).pipe(pluck('rules')).subscribe((rules) =>
      this.form.setControl('rules', this.fb.array(rules?.map((it: Rule) => this.ruleToForm(it)) ?? []))
    )
    this.form.valueChanges
      .pipe(
        map((it) =>
          it.rules?.map((rule) => ({
            patterns: rule?.patterns.filter((pattern) => pattern?.length),
            selector: rule?.selector,
            unwanted: rule?.unwanted?.filter((entry) => entry?.length),
            template: rule?.template ?? defaultTemplate
          }))
            .filter((rule) => rule.patterns?.length)
        ),
        switchMap((value) => browser.storage.local.set({ rules: value }))
      )
      .subscribe()
  }
}
