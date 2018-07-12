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
  selector: 'app',
  template: `
    <p>{{name}}</p>
  `
})
export class AppComp {
  name = 'lx1036';
}

@NgModule({
  declarations: [AppComp]
})
export class AppModule {

}


platformBrowserDynamic().bootstrapModule(AppModule).then(ngModuleRef => console.log(ngModuleRef));
