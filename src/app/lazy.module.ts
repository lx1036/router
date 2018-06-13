import {Component, Injector, NgModule} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {AComponent} from './app.module';


@Component({
  selector: 'lazy-load',
  template: `
    <p>Lazy load component</p>
  `
})
export class LazyLoadComponent {
  constructor(private router: Router, private _injector: Injector) {
    console.log(router.url);

    const aComponent = new AComponent();
    console.log(aComponent.name);

    console.log(_injector.get(Router), _injector);
  }
}


@NgModule({
  declarations: [
    LazyLoadComponent
  ],
  imports: [
    RouterModule.forChild([
      {path: '', redirectTo: 'lazy', pathMatch: 'full'},
      {path: 'lazy', component: LazyLoadComponent}
    ]),
  ],
  exports: [
    LazyLoadComponent
  ]
})
export class LazyLoadModule {}

