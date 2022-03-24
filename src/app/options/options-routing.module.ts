import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ShortcutsComponent} from './shortcuts/shortcuts.component';
import {GeneralComponent} from './general/general.component';
import {OptionsComponent} from './options.component';

const routes: Routes = [
  {path: '', component: OptionsComponent},
  {path: 'general', component: GeneralComponent, outlet: 'options'},
  {path: 'shortcuts', component: ShortcutsComponent, outlet: 'options'},
  {path: 'rules', loadChildren: () => import('./rules/rules.module').then(m => m.RulesModule), outlet: 'options'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OptionsRoutingModule {
}
