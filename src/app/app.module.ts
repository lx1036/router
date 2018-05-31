import { BrowserModule } from '@angular/platform-browser';
import {Component, NgModule} from '@angular/core';

import {PRIMARY_OUTLET, Router, RouterModule, Routes, UrlSegment, UrlSegmentGroup, UrlTree} from '@angular/router';


@Component({
  selector: 'a-comp',
  template: `
    <button routerLink="/b">Navigate to B route</button>
  `
})
export class AComponent {}

@Component({
  selector: 'b-comp',
  template: `
    <button routerLink="/a">Navigate to A route</button>
    <p routerLink="/a" tabindex="1">Navigate to A route</p>
    <a routerLink="/a">Navigate to A route</a>
  `
})
export class BComponent {
  name = 'lx1036';
  constructor(router: Router) {
    const tree: UrlTree = router.parseUrl('advisors;id=1/households;id=2/accounts?source=yodlee&type=investment#balance');
    const group: UrlSegmentGroup = tree.root.children[PRIMARY_OUTLET];
    const segment: UrlSegment[] = group.segments;
    // console.log(group, segment);
  }
}

@Component({
  selector: 'app-root',
  template: `
    <router-outlet (activate)="onActivate($event)" (deactivate)="onDeactive($event)"></router-outlet>
  `
})
export class AppComponent {
  onActivate(value) {
    console.log('activate', value);
  }

  onDeactive(value) {
    console.log('deactivate', value);
  }
}


const routes: Routes = [ // Routes -> Router[setupRouter()]
  {path: '', pathMatch: 'full', redirectTo: 'a'},
  {path: 'a', component: AComponent},
  {path: 'b', component: BComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    AComponent,
    BComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes, {enableTracing: false}), // Routes is built for Router
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
