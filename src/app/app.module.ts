import { BrowserModule } from '@angular/platform-browser';
import {Component, ComponentRef, Injectable, Injector, NgModule, NgModuleFactory, NgModuleFactoryLoader, OnInit} from '@angular/core';

import {
  ActivatedRoute, ActivatedRouteSnapshot, DetachedRouteHandle,
  PreloadAllModules,
  PRIMARY_OUTLET,
  Router, RouteReuseStrategy,
  RouterModule, RouterStateSnapshot,
  Routes,
  UrlSegment,
  UrlSegmentGroup,
  UrlTree
} from '@angular/router';
import { StoreModule } from '@ngrx/store';
import {metaReducers, UserEffects, AuthEffects, stateReducerMap} from './store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import {StoreRouterConnectingModule} from '@ngrx/router-store';
import { EffectsModule } from '@ngrx/effects';
import {LoginComponent} from './components/login/login.component';
import {SignUpComponent} from './components/sign-up/sign-up.component';
import {LandingComponent} from './components/landing/landing.component';
import {FormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from './packages/angular/common/http';
import {AuthGuardService, AuthService, ErrorInterceptor, TokenInterceptor} from './services/auth.service';
import {StatusComponent} from './components/status/status.component';
import {BehaviorSubject, Observable} from 'rxjs';
import {map, pairwise, share, startWith} from 'rxjs/operators';
import {animate, group, query, style, transition, trigger} from '@angular/animations';
import {BrowserAnimationsModule} from './packages/angular/platform-browser/animations';


@Component({
  selector: 'a-comp',
  template: `
    <button routerLink="/b">Navigate to B route</button>
    <router-outlet></router-outlet>
  `
})
export class AComponent {
  name = 'a';

  constructor(private activatedRoute: Router) {
// console.log('ActivatedRoute', _router.routerState.snapshot.root);
//   _router.url.subscribe(urlSegments => {console.log('urlSegments', urlSegments);});
console.log('ActivatedRoute: ', activatedRoute.routerState.snapshot);
    // activatedRoute.params.subscribe((params) => console.log(params));
//     _router.params.subscribe(params => console.log(params));
    // console.log('AComponent', _router.queryParams);
  }
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
  `,
  styles: [
    `
      :host {
        display: block;
        padding-top: 10px;
      }
    `
  ]
})
export class AppComponent implements OnInit {
  constructor(private _loader: NgModuleFactoryLoader, private _injector: Injector) {
    // console.log('NgModuleFactoryLoader', _loader.constructor.name, _injector.get(NgModuleFactoryLoader));
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
    // console.log('activate', value);
  }

  onDeactive(value) {
    // console.log('deactivate', value);
  }
}

@Component({
  selector: 'e',
  template: `
   <p>e</p>
    <router-outlet></router-outlet>
  `
})
export class EComponent {
  constructor(private activatedRoute: ActivatedRoute) {
    // _router.url.subscribe(urlSegments => console.log(urlSegments));
    // console.log('AComponent', _router.queryParams);

    activatedRoute.params.subscribe((params) => console.log(params));
  }
}

@Component({
  selector: 'f',
  template: `
   <p>e</p>
  `
})
export class FComponent {
  constructor(private _router: ActivatedRoute) {
    // _router.url.subscribe(urlSegments => console.log(urlSegments));
    // console.log('AComponent', _router.queryParams);
  }
}


/**
 * https://medium.com/frontend-coach/angular-router-animations-what-they-dont-tell-you-3d2737a7f20b -> RouteReuseStrategy
 */
export interface Item {
  name: string;
}

@Injectable()
export class ItemsService {
  private items: Item[] = [
    {name: 'Nectarine'},
    {name: 'Pomelo'},
    {name: 'Grape'},
    {name: 'Avocado'},
    {name: 'Strawberry'},
    {name: 'Dragonfruit'},
  ];

  getItems(): Item[] {
    return [...this.items];
  }

  getItemByIndex(index: number): Item {
    return this.items[index];
  }
}

// @Injectable()
// export class ItemsRoutingService {
//   itemChange$ = new BehaviorSubject<number>(0);
// }

let itemChange$ = new BehaviorSubject<number>(0);


@Component({
  selector: 'app-item',
  template: `
    <h2>Item: {{item.name}}</h2>
    <p>Lorem ipsum dolor sit!</p>
  `,
  styles: [
    `
      :host {
        display: block;
        position: absolute;
        margin-right: 20px;
      }
    `
  ]
})
export class ItemComponent {
  item: Item;

  constructor(route: ActivatedRoute, itemsService: ItemsService) {
    const { index } = route.snapshot.params;
    this.item = itemsService.getItemByIndex(index);

    itemChange$.next(+index);
  }
}

@Component({
  selector: 'app-items',
  template: `
    <nav class="navbar">
      <div class="navbar-section">
        <a *ngFor="let item of items; index as i" class="btn btn-link" routerLinkActive="active" [routerLink]="i">{{item.name}}</a>
      </div>
    </nav>

    <div [@routeSlide]="routeTrigger$ | async" class="container">
      <nav class="float-right">
        <a [routerLink]="prev$ | async" [class.disabled]="(itemChange$ | async) === 0" class="btn btn-secondary btn-action btn-lg"><i class="icon icon-back"></i></a>
        <a [routerLink]="next$ | async" [class.disabled]="(itemChange$ | async) === items.length - 1" class="btn btn-secondary btn-action btn-lg"><i class="icon icon-forward"></i></a>
      </nav>

      <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: ["./item-component.scss"],
  animations: [
    trigger('routeSlide', [
      transition('* <=> *', [
        group([
          query(':enter', [
            style({transform: 'translateX({{offsetEnter}}%)'}),
            animate('0.4s ease-in-out', style({transform: 'translateX(0%)'}))
          ], {optional: true}),
          query(':leave', [
            style({transform: 'translateX(0%)'}),
            animate('0.4s ease-in-out', style({transform: 'translateX({{offsetLeave}}%)'}))
          ], {optional: true}),
        ])
      ]),
    ]),
  ]
})
export class ItemsComponent {
  items: Item[] = [];
  itemChange$: BehaviorSubject<number>;
  next$: Observable<number>;
  prev$: Observable<number>;
  routeTrigger$: Observable<object>;

  constructor(itemsService: ItemsService) {
    this.items = itemsService.getItems();
    this.itemChange$ = itemChange$;

    this.prev$ = this.itemChange$
      .pipe(
        map(index => index === 0 ? index : index - 1),
        // share()
      );

    this.next$ = this.itemChange$
      .pipe(
        map(index => index === this.items.length - 1 ? index : index + 1),
        // share()
      );

    this.routeTrigger$ = this.itemChange$
      .pipe(
        startWith(0),
        pairwise(),
        map(([prev, curr]) => ({
          value: curr,
          params: {
            offsetEnter: prev > curr ? 100 : -100,
            offsetLeave: prev > curr ? -100 : 100
          }
        })),
      );
  }
}


const routes: Routes = [ // Routes -> Router[setupRouter()]
  // {path: '', pathMatch: 'full', redirectTo: 'a'},
  {path: 'a', component: AComponent},
  {path: 'e/f/g', pathMatch: 'full', redirectTo: 'ee'},
  {path: 'a/:id', component: AComponent, children:
    [
      {path: 'e/:id', component: EComponent, children: [
          {path: 'f/:id', component: EComponent}
        ]
      },
      {path: 'relative/a/:id', redirectTo: 'a/:id'},
      {path: 'absolute/a/:id', redirectTo: '/a/:id'},
      // redirects can't be chained, redirect only once at the same level
      {path: 'a/:id', redirectTo: 'absolute/a/:id'},
      {path: 'a/:id', component: BComponent}
    ]
  },
  {path: 'b', component: BComponent},
  {path: 'c', component: AComponent, outlet: 'feature'},
  {path: 'lazy', loadChildren: './lazy.module#LazyLoadModule'},

  {path: 'log-in', component: LoginComponent},
  {path: 'sign-up', component: SignUpComponent},
  {path: 'status', component: StatusComponent, canActivate: [AuthGuardService]},
  // {path: '', component: LandingComponent},
  // {path: '**', redirectTo: '/'}


  // Custom RouteReuseStrategy
  {path: '', redirectTo: 'items', pathMatch: 'full'},
  {path: 'items', component: ItemsComponent,
    children: [
      {path: '', redirectTo: '0', pathMatch: 'full'},
      {path: ':index', component: ItemComponent}
    ]
  },
];


export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  handlers: {[key: string]: DetachedRouteHandle} = {};

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    if (!route.routeConfig) {
      return null;
    }

    return this.handlers[route.routeConfig.path];
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return false;
  }

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return !!route.routeConfig && !!this.handlers[route.routeConfig.path];
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    // console.log(curr.component);

    return curr.component !== ItemComponent;
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
    this.handlers[route.routeConfig.path] = null;
  }
}


@NgModule({
  declarations: [
    AppComponent,
    AComponent,
    BComponent,

    LoginComponent,
    SignUpComponent,
    LandingComponent,
    StatusComponent,
    EComponent,
    FComponent,

    ItemsComponent,
    ItemComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,

    // RouterModule.forRoot(routes, {enableTracing: false, preloadingStrategy: PreloadAllModules}), // PreLoad lazy load modules
    RouterModule.forRoot(routes, {enableTracing: false}), // Routes is built for Router
    StoreModule.forRoot(stateReducerMap, { metaReducers }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    StoreRouterConnectingModule.forRoot({stateKey: 'routerState'}),
    EffectsModule.forRoot([UserEffects, AuthEffects]),
  ],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: CustomRouteReuseStrategy,
    },
    ItemsService,
    // ItemsRoutingService,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    AuthGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
