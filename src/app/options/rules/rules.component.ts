import { Component, OnInit } from '@angular/core'
import { ExtensionService } from '../../extension.service'
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { filter, map, switchMap } from 'rxjs/operators'
import type { Rule } from 'src/app/rule.service'
import defaultTemplate from '../../../assets/default.template'
import { ExportTemplateService } from '../../export-template.service'
import { OptionService } from '../../option.service'

type RuleForm = {
  patterns: FormArray<FormControl<string>>
  selector: FormArray<FormControl<string>>
  ignored: FormArray<FormControl<string>>
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
    private extensionService: ExtensionService,
    private fb: FormBuilder,
    private templateService: ExportTemplateService,
    private optionService: OptionService,
    route: ActivatedRoute
  ) {
    // TODO 符合 url 的规则排在上面
  }

  rulesForm = () => this.form.get('rules') as FormArray<FormGroup<RuleForm>>

  patternsForm = (rule: AbstractControl) => rule.get('patterns') as FormArray<AbstractControl<string>>

  ignoredForm = (rule: AbstractControl) => rule.get('ignored') as FormArray<AbstractControl<string>>
  selectorForm = (rule: AbstractControl) => rule.get('selector') as FormArray<AbstractControl<string>>

  addRule(data?: Rule) {
    this.rulesForm().insert(
      0,
      this.ruleToForm({ patterns: [''], template: this.templateService.defaultTemplate, ...data })
    )
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
      patterns: this.fb.array((data.patterns ?? []).map((it) => this.fb.control(it, { nonNullable: true }))),
      selector: this.fb.array((data.selector ?? []).map((it) => this.fb.control(it, { nonNullable: true }))),
      ignored: this.fb.array((data.ignored ?? []).map((it) => this.fb.control(it, { nonNullable: true }))),
      template: this.fb.control(data.template)
    })

  ngOnInit(): void {
    this.optionService
      .get('rules')
      .subscribe((rules) =>
        this.form.setControl('rules', this.fb.array((rules ?? []).map((it: Rule) => this.ruleToForm(it))))
      )
    this.form.valueChanges
      .pipe(
        map((it) =>
          it.rules
            ?.map(
              (rule) =>
                <Rule>{
                  patterns: rule?.patterns?.filter((it) => it?.length) ?? [],
                  selector: rule?.selector?.filter((it) => it?.length),
                  ignored: rule?.ignored?.filter((it) => it?.length),
                  template: rule?.template ?? defaultTemplate
                }
            )
            .filter((rule) => rule.patterns?.length)
        ),
        filter((it): it is Rule[] => !!it),
        switchMap((value) => this.optionService.set({ rules: value }))
      )
      .subscribe()
  }
}
