import {BrowserModule} from '@angular/platform-browser';
import {Component, NgModule, ApplicationRef} from '@angular/core';

@Component({
  selector: 'test',
  template: `
    <p>test</p>
  `
})
export class MyComponent {}

let c = {cc: 'cc'};
let d = c;
c.cc = 'xxx';
console.log(d,c);
@NgModule({
  imports: [BrowserModule],
  declarations: [MyComponent],
  entryComponents: [MyComponent]
})
export class MainModule {
  constructor(appRef: ApplicationRef) {
    appRef.bootstrap(MyComponent);
  }
}
