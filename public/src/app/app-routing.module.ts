import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ListComponent} from './list/list.component';
import {UserResolverService} from './user-resolver.service';
import {WelcomeComponent} from './welcome/welcome.component';

const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'welcome'
  },
  {
    path: 'welcome',
    component: WelcomeComponent,
    resolve: {
      user: UserResolverService,
    },
  },
  {
    path: 'lists/:id',
    component: ListComponent,
    resolve: {
      user: UserResolverService,
    },
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
    )
  ],
  exports: [
    RouterModule
  ],
  providers: [
    UserResolverService,
  ]
})
export class AppRoutingModule {
}
