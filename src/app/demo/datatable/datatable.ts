import {Component, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {NgxDatatableModule} from './src';


/**
 * Datatable:
 * datatable-header
 * datatable-body
 * datatable-footer
 */
@Component({
  selector: 'demo-datatable',
  template: `
    <div>
      <ngx-datatable
        [rows]="rows"
        [columns]="columns"
        [loadingIndicator]="true"
      >
      </ngx-datatable>
    </div>
  `,
  styles: [
    `
        
    `
  ]
})
export class DemoDataTableComponent {
  rows = [
    { name: 'Austin', gender: 'Male', company: 'Swimlane' },
    { name: 'Dany', gender: 'Male', company: 'KFC' },
    { name: 'Molly', gender: 'Female', company: 'Burger King' },
  ];
  columns = [
    { prop: 'name' },
    { name: 'Gender' },
    { name: 'Company' }
  ];
}



@NgModule({
  imports:[
    BrowserModule,
    NgxDatatableModule,
  ],
  declarations: [
    DemoDataTableComponent,
  ],
  bootstrap: [
    DemoDataTableComponent,
  ]
})
export class DemoDataTableModule {
  
}