import { Component, OnInit } from '@angular/core'
import { from } from 'rxjs'
import { BrowserService } from '../../browser.service'
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { map, switchMap } from 'rxjs/operators'
import { Rule } from 'src/app/rule.service'
import defaultTemplate from '../../../assets/default.template'
import { ExportTemplateService } from '../../export-template.service'

type RuleForm = {
  patterns: FormArray<FormControl<string | null>>
  selector: FormArray<FormControl<string | null>>
  ignored: FormArray<FormControl<string | null>>
  template: FormControl<string | null | undefined>
}

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit {

  form = this.fb.group({
    rules: this.fb.array<FormGroup<RuleForm>>([])
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
    return this.form.get('rules') as FormArray<FormGroup<RuleForm>>
  }

  patternsForm(rule: AbstractControl) {
    return rule.get('patterns') as FormArray<AbstractControl<string>>
  }

  ignoredForm = (rule: AbstractControl) => rule.get('ignored') as FormArray<AbstractControl<string>>
  selectorForm = (rule: AbstractControl) => rule.get('selector') as FormArray<AbstractControl<string>>

  addRule(data: Rule = { patterns: [''], template: this.templateService.defaultTemplate }) {
    this.rules.insert(0, this.ruleToForm(data))
  }

  addPatternControl(patterns: FormArray) {
    patterns.push(this.fb.control(''))
  }

  addIgnoredControl(ignored: FormArray) {
    ignored.push(this.fb.control(''))
  }

  addSelectorControl(selector: FormArray) {
    selector.push(this.fb.control(''))
  }

  ruleToForm = (data: Rule): FormGroup<RuleForm> =>
    this.fb.group({
      patterns:
        <FormArray<FormControl<string | null>>>data.patterns
          ?.map((it) => this.fb.control(it))
          .reduce((prev, curr) => {
            prev.push(curr)
            return prev
          }, this.fb.array([])) ?? this.fb.array([]),
      selector:
        <FormArray<FormControl<string | null>>>data.selector
          ?.map((it) => this.fb.control(it))
          .reduce((prev, curr) => {
            prev.push(curr)
            return prev
          }, this.fb.array([])) ?? this.fb.array([]),
      ignored:
        <FormArray<FormControl<string | null>>>data.ignored
          ?.map((it) => this.fb.control(it))
          .reduce((prev, curr) => {
            prev.push(curr)
            return prev
          }, this.fb.array([])) ?? this.fb.array([]),
      template: this.fb.control(data.template)
    })

  ngOnInit(): void {
    from(browser.storage.local.get('rules'))
      .pipe(map((it) => <Rule[]>it.rules))
      .subscribe((rules) =>
        this.form.setControl('rules', this.fb.array(rules?.map((it: Rule) => this.ruleToForm(it)) ?? []))
      )
    this.form.valueChanges
      .pipe(
        map((it) =>
          it.rules
            ?.map((rule) => ({
              patterns: rule?.patterns?.filter((pattern) => pattern?.length),
              selector: rule?.selector,
              ignored: rule?.ignored?.filter((entry) => entry?.length),
              template: rule?.template ?? defaultTemplate
            }))
            .filter((rule) => rule.patterns?.length)
        ),
        switchMap((value) => browser.storage.local.set({ rules: value }))
      )
      .subscribe()
  }
}
