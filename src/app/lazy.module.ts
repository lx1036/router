import {Component, NgModule} from '@angular/core';


@Component({
  selector: 'lazy-load',
  template: `
    <p>Lazy load component</p>
  `
})
export class LazyComponent {}


@NgModule({
  declarations: [
    LazyComponent
  ],
  exports: [
    LazyComponent
  ]
})
export class LazyModule {}
