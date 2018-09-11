import {Injectable, NgModule} from '@angular/core';
import {Observable, of} from 'rxjs';
import {concatMap} from 'rxjs/operators';



interface HttpHandler {
  handle(request: Request): Observable<Response>;
}


@Injectable()
export class XhrHandler implements HttpHandler {
  handle(request: Request): Observable<Response> {
    const xhr = new XMLHttpRequest();
    xhr.open(request.method, request.uri);

    if (!! request.withCredentials) {
      xhr.withCredentials = true;
    }

    
    // request.headers.forEach((value, header) => xhr.setRequestHeader(header, value));
  
    const requestBody = request.serializeBody();
  
    
    const onLoad = () => {
      // const body = xhr.response;
  
      /**
       * pragma: no-cache
       * content-type: application/json; charset=utf-8
       * cache-control: public, max-age=14400
       * expires: Sat, 08 Sep 2018 17:04:37 GMT
       */
      const headers = new Headers(xhr.getAllResponseHeaders());
      
      return new Response(xhr.response, headers, xhr.status, xhr.statusText);
    };
    xhr.addEventListener('load', onLoad);
    
  
    xhr.send(requestBody);

    
    
    
    return undefined;
  }

}


class Response {
  constructor(private body, private headers: Headers, private status, private statusText) {}
}

class Headers {
  headers: Map<string, string[]>;
  
  
  constructor(headers: string) {
    this.headers = new Map<string, string[]>();
    headers.split('\n').forEach(line => {
      const index = line.indexOf(':');
      const name = line.slice(0, index);
      const value = line.slice(index + 1).trim();
      
      this.headers.set(name, [value]);
    });
  }
  
  forEach(name: string, values: string[]) {
  
  }
}

export class Request {
  withCredentials: boolean;
  headers: Headers;
  
  constructor(public method: Methods, public uri: string, options?: {}) {

  }

  clone(options: {}) {}
  
  serializeBody() {
  
  }
}



type Methods = 'GET'|'POST'|'PUT'|'DELETE'|'HEAD'|'OPTIONS';

@Injectable()
export class HttpClient {
  constructor(private handler: HttpHandler) {}

  request(method: Methods, uri: string, options?: {

  }): Observable<any>
  {
    let request = new Request(method, uri, options);

    let response = of(request).pipe(concatMap((request) => this.handler.handle(request)));

    return response;
  }
  
  get(uri: string) {
    return this.request('GET', uri);
  }
}

















 







@NgModule({
  providers: [
    HttpClient,
  ]
})
export class HttpModule {

}