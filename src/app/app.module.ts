import { BrowserModule } from '@angular/platform-browser';
import {Component, ComponentRef, Injector, NgModule, NgModuleFactory, NgModuleFactoryLoader, OnInit} from '@angular/core';

import {
  ActivatedRoute,
  PreloadAllModules,
  PRIMARY_OUTLET,
  Router,
  RouterModule,
  Routes,
  UrlSegment,
  UrlSegmentGroup,
  UrlTree
} from '@angular/router';


@Component({
  selector: 'a-comp',
  template: `
    <button routerLink="/b">Navigate to B route</button>
  `
})
export class AComponent {
  name = 'a';
}

@Component({
  selector: 'b-comp',
  template: `
    <button routerLink="/a">Navigate to A route</button>
    <p routerLink="/b" tabindex="1" routerLinkActive="pClass">Navigate to A route</p>
    <a routerLink="/b" routerLinkActive="aClass bClass" [routerLinkActiveOptions]="{exact: true}">Navigate to A route</a>
    
    <h2>RouterOutlet</h2>
    <button [routerLink]="['/', {outlets: {feature: ['c']}}]">Navigate to C route</button>
    
    <h2>Navigate</h2>
    <button (click)="navigate()">Navigate</button>
    
    <h2>LazyLoad</h2>
    <button routerLink="/lazy/lazy">lazyload</button>
  `,
  styles: [`
    .pClass {
        background-color: red;
    }
    .aClass {
        background-color: blue;
    }
    .bClass {
        font-size: large;
    }
  `]
})
export class BComponent {
  name = 'lx1036';
  constructor(private router: Router, private route: ActivatedRoute) {
    const tree: UrlTree = router.parseUrl('/section-one;test=one/(nav:navigation;test=two//main:about;test=three)?query=four#frag');
    const group: UrlSegmentGroup = tree.root.children[PRIMARY_OUTLET];
    const segments: UrlSegment[] = group.segments;

    console.log('Step 1: Parse Url to UrlTree', segments, tree.queryParams, tree.fragment);

    // console.log(group, segment);

    // console.log('RouterState', router.routerState);

    // create a url tree by commands
    router.createUrlTree(['a', 'b']);
  }

  navigate() {
    /**
     * 1. create a url tree
     *  1.1 create an empty tree: new UrlTree(UrlSegmentGroup, queryParams, fragment), https://.../?...#...
     *  1.2 merge commands with empty url tree
     */
    this.router.navigate(['a'], {relativeTo: this.route});
    // this.router.navigate(['/a'], {relativeTo: this.route});
  }
}

@Component({
  selector: 'app-root',
  template: `
    <router-outlet (activate)="onActivate($event)" (deactivate)="onDeactive($event)"></router-outlet>
    <router-outlet name="feature"></router-outlet>
  `
})
export class AppComponent implements OnInit {
  constructor(private _loader: NgModuleFactoryLoader, private _injector: Injector) {
    console.log('NgModuleFactoryLoader', _loader.constructor.name, _injector.get(NgModuleFactoryLoader));

  }

  ngOnInit() {
    /*this.loader.load('./lazy.module#LazyModule').then((ngModuleFactory: NgModuleFactory<any>) => {
      const moduleRef = ngModuleFactory.create(this._injector);

      if (moduleRef.componentFactoryResolver) {
        // console.log(moduleRef.componentFactoryResolver.resolveComponentFactory(LazyLoadComponent));
      }

      // const componentRef: ComponentRef<LazyLoadComponent> = moduleRef.componentFactoryResolver.resolveComponentFactory(LazyLoadComponent).create(this._injector);
      // console.log(`${componentRef.instance}: `, componentRef.hostView, componentRef.location);
    });*/
  }

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
  {path: 'c', component: AComponent, outlet: 'feature'},
  {path: 'lazy', loadChildren: './lazy.module#LazyLoadModule'},
];

@NgModule({
  declarations: [
    AppComponent,
    AComponent,
    BComponent,
  ],
  imports: [
    BrowserModule,
    // RouterModule.forRoot(routes, {enableTracing: false, preloadingStrategy: PreloadAllModules}), // PreLoad lazy load modules
    RouterModule.forRoot(routes, {enableTracing: false}), // Routes is built for Router
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
