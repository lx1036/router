import {Component, NgModule, OnInit} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {ActivatedRoute, Router, RouterModule, Routes, RoutesRecognized} from '@angular/router';
import {children} from '../../packages/angular/compiler-cli/integrationtest/bazel/injectable_def/app/src/root';
import {filter, filter} from 'rxjs/operators';

/**
 * https://angular.cn/guide/router
 *
 * 链接参数数组 link parameter array：(TODO:)
 */

@Component({
  selector: 'advisor',
  template: `
    <a routerLink="household">Advisor</a>
    <router-outlet></router-outlet>
  `
})
export class AdvisorComponent implements OnInit {
  constructor(private _route: ActivatedRoute) {}

  ngOnInit() {
    this._route.params.subscribe(params => {
      console.log(params);
    });

    // this._router.routerState.root.firstChild.params.subscribe(params => {
    //   console.log(params);
    // });
    // console.log(this._router.routerState, this._router.routerState.root.children, this._router.routerState.toString());
  }
}

@Component({
  selector: 'household',
  template: `
    <p>Household</p>
  `
})
export class HouseholdComponent implements OnInit {
  constructor(private _route: ActivatedRoute, private _router: Router) {}

  ngOnInit() {
    this._route.params.subscribe(params => {
      console.log(params);
    });

    console.log(this._router.routerState.root.children);


    this._router.routerState.root.firstChild.params.subscribe(params => {
      console.log(params);
    });

    // console.log(this._router.routerState.root.params);
  }
}


@Component({
  selector: 'custom-header',
  template: `
    <nav>
      <a routerLink="/advisor/1/household/1">Nav1</a>
      <a routerLink="/advisor/2/household/2">Nav2</a>
    </nav>
  `
})
export class DemoCustomHeader implements OnInit {
  constructor(private _router: Router, private _route: ActivatedRoute) {}

  ngOnInit() {
    console.log(this._router.routerState.root.children);

    this._router.events.pipe(
      filter(event => event instanceof RoutesRecognized),
    ).subscribe((event: RoutesRecognized) => {
      console.log(event.state.root, event.state.root.firstChild.params, event.state.root.firstChild.firstChild.params, event.url, event.urlAfterRedirects);
    });
    // this._router.events.pipe(filter(events => events instanceof RoutesRecognized)).subscribe(
    //   (event: RoutesRecognized) => {
    //   console.log(event.state.root.firstChild.params, event.state.root.firstChild.children[0].params);
    //
    //   console.log(event.state.root.firstChild, event.state.root.children);
    // });
    //
    // console.log(this._router.routerState.root.children);
    //
    // this._route.params.subscribe(params => {
    //   console.log(params);
    // });
  }
}

@Component({
  selector: 'demo-router',
  template: `
    <custom-header></custom-header>
    <router-outlet></router-outlet>
  `
})
export class DemoRouter {

}


const routes: Routes = [
  {
    path: '',
    redirectTo: 'advisor/1',
    pathMatch: 'full'
  },
  {
    path: 'advisor/:advisorId',
    component: AdvisorComponent,
    children: [
      {
        path: 'household/:householdId',
        component: HouseholdComponent,
      },
      {
        path: 'households',
        component: HouseholdComponent,
      }
    ]
  },
];

@NgModule({
  imports: [BrowserModule, RouterModule.forRoot(routes)],
  declarations: [
    DemoRouter,
    DemoCustomHeader,
    AdvisorComponent,
    HouseholdComponent,
  ],
  bootstrap: [DemoRouter]
})
export class DemoRouterModule {

}