import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BackgroundComponent} from "./background.component";

const routes: Routes = [
  {path: '', component: BackgroundComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackgroundRoutingModule {
}
