import { BrowserModule } from '@angular/platform-browser';
import {Component, ComponentRef, Injector, NgModule, NgModuleFactory, NgModuleFactoryLoader, OnInit} from '@angular/core';

import {
  ActivatedRoute, ActivatedRouteSnapshot,
  PreloadAllModules,
  PRIMARY_OUTLET,
  Router,
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
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from './packages/angular/common/http';
import {AuthGuardService, AuthService, ErrorInterceptor, TokenInterceptor} from './services/auth.service';
import {StatusComponent} from './components/status/status.component';
import {BrowserAnimationsModule} from './packages/angular/platform-browser/animations';
import {animate, animateChild, group, query, sequence, stagger, style, transition, trigger} from '@angular/animations';
import {Location} from '@angular/common';
import {AddressComp, PersonInfoComp} from './nested-form';


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


    <h2>Animations</h2>
    <nav>
      <a routerLink="/home" routerLinkActive="active">Home</a>
      <a routerLink="/about" routerLinkActive="active">About</a>
    </nav>
    <main [@routerTransition]="getState(o)">
      <router-outlet #o="outlet" name="animation"></router-outlet>
    </main>
    
    
    <button (click)="onLocation()">Location</button>
    
    
    <h2>Nested Forms</h2>
    <nested-form></nested-form>
  `,
  animations: [
    trigger('routerTransition', [
      transition('* => *', [
        query(':enter, :leave', style({ position: 'fixed', width:'100%' }), {optional: true}),
        query(':enter', style({ transform: 'translateX(100%)' }), {optional: true}),
        sequence([
          query(':leave', animateChild(), {optional: true}),
          group([
            query(':leave', [
              style({ transform: 'translateX(0%)' }),
              animate('500ms cubic-bezier(.75,-0.48,.26,1.52)',
                style({ transform: 'translateX(-100%)' }))
            ], {optional: true}),
            query(':enter', [
              style({ transform: 'translateX(100%)' }),
              animate('500ms cubic-bezier(.75,-0.48,.26,1.52)',
                style({ transform: 'translateX(0%)' })),
            ], {optional: true}),
          ]),
          query(':enter', animateChild(), {optional: true}),
        ])
      ])
    ])
  ]
})
export class AppComponent implements OnInit {
  constructor(private _loader: NgModuleFactoryLoader, private _injector: Injector, private _location: Location, private _router: Router) {
    // console.log('NgModuleFactoryLoader', _loader.constructor.name, _injector.get(NgModuleFactoryLoader));

    console.log(_router.routerState.root);

    const tree: UrlTree = _router.parseUrl('/section-one;test=one/(nav:navigation;test=two//main:about;test=three)?query=four#frag');
    const primaryOutlet: UrlSegmentGroup = tree.root.children[PRIMARY_OUTLET];
    console.log(tree.root, primaryOutlet, primaryOutlet.segments, primaryOutlet.children[PRIMARY_OUTLET], primaryOutlet.children['support'], tree.queryParams, tree.fragment);
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

  getState(outlet) {
    return outlet.activatedRouteData.state;
  }

  onLocation() {
    this._location.go('a');
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


@Component({
  selector: 'home',
  template: `
    <h1>Home</h1>
    <div class="header">
      <div class="block">&nbsp;</div>
      <div class="block">&nbsp;</div>
      <div class="block">&nbsp;</div>
    </div>
  `,
  styles: [`
    .block {
      background: #eee;
      float: left;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      margin: 5px;
    }
  `],
  animations: [
    trigger('homeTransition', [
      transition(':enter', [
        query('.block', style({ opacity: 0 }), {optional: true}),
        query('.block', stagger(300, [
          style({ transform: 'translateY(100px)' }),
          animate('1s cubic-bezier(.75,-0.48,.26,1.52)', style({transform: 'translateY(0px)', opacity: 1})),
        ]), {optional: true}),
      ]),
      transition(':leave', [
        query('.block', stagger(300, [
          style({ transform: 'translateY(0px)', opacity: 1 }),
          animate('1s cubic-bezier(.75,-0.48,.26,1.52)', style({transform: 'translateY(100px)', opacity: 0})),
        ]), {optional: true}),
      ])
    ])
  ],
})
export class HomeComponent { }

@Component({
  selector: 'about',
  template: `<h1>About</h1>`
})
export class AboutComponent { }

const routes: Routes = [ // Routes -> Router[setupRouter()]
  {path: '', redirectTo: 'about', pathMatch: 'full'},
  {path: 'home', component: HomeComponent, data: { state: 'home'}, outlet: 'animation' },
  {path: 'about', component: AboutComponent, data: { state: 'about'}, /*outlet: 'feature'*/ },

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
];

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

    HomeComponent,
    AboutComponent,

    PersonInfoComp,
    AddressComp,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    // RouterModule.forRoot(routes, {enableTracing: false, preloadingStrategy: PreloadAllModules}), // PreLoad lazy load modules
    RouterModule.forRoot(routes, {enableTracing: false, /*initialNavigation: 'disabled'*/}), // Routes is built for Router
    // StoreModule.forRoot(stateReducerMap, { metaReducers }),
    // !environment.production ? StoreDevtoolsModule.instrument() : [],
    // StoreRouterConnectingModule.forRoot({stateKey: 'routerState'}),
    // EffectsModule.forRoot([UserEffects, AuthEffects]),
  ],
  providers: [
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
