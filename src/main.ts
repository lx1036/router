import {COMPILER_OPTIONS, CompilerFactory, createPlatformFactory, enableProdMode, PLATFORM_INITIALIZER} from '@angular/core';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import {PlatformRef} from './app/packages/angular/core/src/application_ref';
import {Console} from './app/packages/angular/core/src/console';
import {TestabilityRegistry} from './app/packages/angular/core/src/testability/testability';
import {Injector, StaticProvider} from './app/packages/angular/core/src/di';
import {PLATFORM_ID} from './app/packages/angular/core/src/application_tokens';
import {ResourceLoader} from '@angular/compiler';
import {ResourceLoaderImpl} from './app/packages/angular/platform-browser-dynamic/src/resource_loader/resource_loader_impl';
import {ɵINTERNAL_BROWSER_PLATFORM_PROVIDERS as INTERNAL_BROWSER_PLATFORM_PROVIDERS} from '@angular/platform-browser';
import {PlatformLocation, ɵPLATFORM_BROWSER_ID as PLATFORM_BROWSER_ID} from '@angular/common';
import {JitCompilerFactory} from './app/packages/angular/platform-browser-dynamic/src/compiler_factory';
import {BrowserPlatformLocation} from './app/packages/angular/platform-browser/src/browser/location/browser_platform_location';
import {_document, initDomAdapter} from './app/packages/angular/platform-browser/src/browser';
import {DOCUMENT} from './app/packages/angular/platform-browser/src/dom/dom_tokens';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));




/*export const platformCore: ((extraProviders?: StaticProvider[]) => PlatformRef) = createPlatformFactory(null, 'core', [
  // Set a default platform name for platforms that don't set it explicitly.
  {provide: PLATFORM_ID, useValue: 'unknown'},
  {provide: PlatformRef, deps: [Injector]},
  {provide: TestabilityRegistry, deps: []},
  {provide: Console, deps: []},
]);

export const platformCoreDynamic: ((extraProviders?: StaticProvider[]) => PlatformRef) = createPlatformFactory(platformCore, 'coreDynamic', [
  {provide: COMPILER_OPTIONS, useValue: {}, multi: true},
  {provide: CompilerFactory, useClass: JitCompilerFactory, deps: [COMPILER_OPTIONS]},
]);


const platformBrowserDynamicTest =createPlatformFactory(platformCoreDynamic, 'browserDynamic', [
  [
    {provide: PLATFORM_ID, useValue: PLATFORM_BROWSER_ID},
    {provide: PLATFORM_INITIALIZER, useValue: initDomAdapter, multi: true},
    {provide: PlatformLocation, useClass: BrowserPlatformLocation, deps: [DOCUMENT]},
    {provide: DOCUMENT, useFactory: _document, deps: []},
  ],
  {
    provide: COMPILER_OPTIONS,
    useValue: {providers: [{provide: ResourceLoader, useClass: ResourceLoaderImpl, deps: []}]},
    multi: true
  },
  {provide: PLATFORM_ID, useValue: PLATFORM_BROWSER_ID},
]);

const platformRef: PlatformRef = platformBrowserDynamicTest();

console.log(platformRef.injector);*/

