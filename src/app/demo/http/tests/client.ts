import {Component, NgModule, OnInit} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {HttpClient, HttpModule} from "../src/client";




@Component({
  selector: 'demo-http',
  template: `
    <div>
      <pre>
        {{posts | json}}
      </pre>
    </div>
  `
})
export class DemoHttp implements OnInit {
  public posts;
  
  public constructor(private http: HttpClient) {
  }
  
  ngOnInit() {
    this.http.get('https://jsonplaceholder.typicode.com/posts/1').subscribe(res => {
      this.posts = res;
    });
  }
}





@NgModule({
  declarations: [
    DemoHttp,
  ],
  imports: [
    BrowserModule,
    
    HttpModule,
  ],
  providers: [
  ],
  bootstrap: [DemoHttp]
})
export class TestCustomHttpClientModule {

}


