import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: "background",
    pathMatch: 'full',
    loadChildren: () => import('./background/background.module').then(m => m.BackgroundModule)
  },
  {
    path: "options",
    pathMatch: 'full',
    loadChildren: () => import('./options/options.module').then(m => m.OptionsModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
