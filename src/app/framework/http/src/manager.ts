import {Injectable, NgModule} from '@angular/core';
import {Observable, Observer, of} from 'rxjs';
import {concatMap} from 'rxjs/operators';
import {HTTP_INTERCEPTORS, HttpBackend, HttpHandler, HttpHandlerService, NoopInterceptor, XhrBackend} from "./handler";
import {HttpInterceptorHandler} from "./handler";
import {HttpEvent, Methods, Request} from "./model";





/**
 * Perform HTTP requests.
 *
 */
@Injectable()
export class HttpClient {
  constructor(private handler: HttpHandler) {}

  request(method: Methods, uri: string, options?: {}): Observable<HttpEvent<any>> {
    let request = new Request(method, uri, options);

    let response = of(request).pipe(concatMap(
      (request: Request<any>): Observable<HttpEvent<any>> => this.handler.handle(request)
    ));

    return response;
  }
  
  get(uri: string): Observable<any> {
    return this.request('GET', uri);
  }
}



/**
 * Handler(send xhr request) + Interceptor(intercept xhr request, do something)
 */
@NgModule({
  providers: [
    HttpClient,
    {provide: HttpHandler, useClass: HttpHandlerService},
    {provide: HttpBackend, useClass: XhrBackend},
    {provide: HTTP_INTERCEPTORS, useClass: NoopInterceptor, multi: true}
  ]
})
export class CustomHttpModule {

}