import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { concat, from, pluck } from 'rxjs'
import { BrowserService } from '../../browser.service'
import { AbstractControl, FormArray, FormBuilder } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { map, switchMap, tap } from 'rxjs/operators'
import { Rule } from 'src/app/rule.service'
import { ArticleParserService } from '../../article-parser.service'
import defaultTemplate from '../../assets/default.eta'

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RulesComponent implements OnInit {
  form = this.fb.group({
    rules: this.fb.array([])
  })

  constructor(
    private browserService: BrowserService,
    private fb: FormBuilder,
    route: ActivatedRoute,
    private articleParserService: ArticleParserService
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
    data: {
      patterns: string[]
      selector?: string
      unwanted?: string[]
    } = { patterns: [''] }
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
    concat(
      from(browser.storage.local.get('rules')).pipe(pluck('rules')),
      this.browserService.storage.change('local').pipe(pluck('rules', 'newValue'))
    ).subscribe((rules) => {
      this.form.setControl('rules', this.fb.array(rules?.map((it: Rule) => this.ruleToForm(it)) ?? []))
    })
    this.form.valueChanges
      .pipe(
        map((it) =>
          it.rules
            .map((rule: Rule) => ({
              patterns: rule.patterns.filter((pattern) => pattern?.length),
              selector: rule.selector,
              unwanted: rule.unwanted?.filter((entry) => entry?.length),
              template: rule.template ?? defaultTemplate
            }))
            .filter((rule: Rule) => rule.patterns?.length)
        ),
        tap((value) => this.articleParserService.rules(value)),
        switchMap((value) => browser.storage.local.set({ rules: value }))
      )
      .subscribe()
  }
}
