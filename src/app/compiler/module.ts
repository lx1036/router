import {Component, NgModule} from '@angular/core';
import "../packages/angular/goog";
import "hammerjs";
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';


/**
 * https://www.zhihu.com/question/58083132/answer/155731764
 * Angular under the water
 *
 * yarn ngc -p src/app/compiler/tsconfig.json
 */

@Component({
  selector: 'a-comp',
  template: `
    <p>A Comp</p>
  `
})
export class AComp {

}

/**
 * @link https://juejin.im/post/5b2158b8f265da6dfe09f05d [译] 别再对 Angular Modules 感到迷惑
 * @link https://juejin.im/post/5b61e925f265da0f48612f23 [译] Angular 的 @Host 装饰器和元素注入器
 */
export class AService {

}

@NgModule({
  providers: [
    {provide: 'b', useValue: 'c'}
  ]
})
export class BModule {

}

@NgModule({
  imports: [],
  declarations: [AComp],
  providers: [
    AService,
    {provide: 'a', useValue: 'a'},
    {provide: 'b', useValue: 'b'},
  ],
  exports: [AComp]
})
export class AModule {

}



@Component({
  selector: 'app',
  template: `
    <p>{{name}}</p>
    <a-comp></a-comp>
  `
})
export class AppComp {
  name = 'lx1036';
}

export class BService {

}

@NgModule({
  imports: [AModule, BModule],
  declarations: [AppComp],
  providers: [
    BService,
    {provide: 'a', useValue: 'b'}
  ],
  bootstrap: [AppComp]
})
export class AppModule {

}


platformBrowserDynamic().bootstrapModule(AppModule).then(ngModuleRef => console.log(ngModuleRef));
