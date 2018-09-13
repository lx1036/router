import {Observable, Observer, Subscriber} from "rxjs";
import {Injectable, InjectionToken, Injector} from "@angular/core";
import {Request, HttpEvent, ErrorResponse, Response, Headers, EventType, HeaderResponse} from "./model";




export abstract class HttpHandler {
  abstract handle(request: Request<any>): Observable<HttpEvent<any>>;
}


export abstract class HttpBackend extends HttpHandler{

}

export const HTTP_INTERCEPTORS = new InjectionToken<Interceptor[]>('HTTP_INTERCEPTORS');


export abstract class Interceptor {
  abstract intercept(request: Request<any>, next: HttpHandler);
}

export class NoopInterceptor implements Interceptor {
  intercept(request: Request<any>, next: HttpHandler) {
    return next.handle(request);
  }
}


/**
 * TODO:
 * Subscriber implements Observer
 * Subscription
 */

/**
 * This instance is mainly sending real request to backend
 */
@Injectable()
export class XhrBackend implements HttpBackend {
  handle(request: Request<any>): Observable<HttpEvent<any>> {

    return new Observable<HttpEvent<any>>((subscriber: Subscriber<HttpEvent<any>>) => {
      /**
       * xhr spec: https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest
       * event types: onload, onloadstart, onloadend, onerror, onprogress, onabort
       * using: https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest
       */
      const xhr = new XMLHttpRequest();
      xhr.open(request.method, request.url, true);

      if (!! request.withCredentials) {
        xhr.withCredentials = true;
      }

      request.headers.forEach((name, values: string[]) => xhr.setRequestHeader(name, values.join(',')));


      // request.headers.forEach((value, header) => xhr.setRequestHeader(header, value));

      const getHeaderResponse = () => {
        /**
         * pragma: no-cache
         * content-type: application/json; charset=utf-8
         * cache-control: public, max-age=14400
         * expires: Sat, 08 Sep 2018 17:04:37 GMT
         */
        const headers = new Headers(xhr.getAllResponseHeaders());
        const status = xhr.status;
        const statusText = xhr.statusText;
        const url = xhr.responseURL || request.url;

        return new HeaderResponse({headers, status, statusText, url});
      };

      /**
       * The 'onload' event handler, meaning the response is available
       */
      const onLoad = (event: Event) => {
        // const {headers, status, statusText, url} = getHeaderResponse();

        /**
         * TODO: remove this
         */
        const headers = new Headers(xhr.getAllResponseHeaders());
        const status = xhr.status;
        const statusText = xhr.statusText;
        const url = xhr.responseURL || request.url;

        subscriber.next(new Response(xhr.response, headers, xhr.status, xhr.statusText));
        subscriber.complete();
      };

      const onError = (event: ErrorEvent) => {
        subscriber.error(new ErrorResponse({error: event, status: xhr.status, statusText: xhr.statusText || 'Unknown Error'}));
      };

      /**
       * The download progress event handler.
       */
      const onDownloadProgress = (event: ProgressEvent) => {};
      /**
       * The upload progress event handler.
       */
      const onUploadProgress = (event: ProgressEvent) => {};
      xhr.addEventListener('load', onLoad);
      xhr.addEventListener('error', onError);

      const requestBody = request.serializeBody();

      if (request.isProgressed) {
        xhr.addEventListener('progress', onDownloadProgress);

        if (xhr.upload && requestBody !== null) {
          xhr.upload.addEventListener('progress', onUploadProgress);
        }
      }

      // send the request, and notify the event stream
      xhr.send(requestBody);
      subscriber.next({type: EventType.Sent});

      return () => {};
    });
  }

}




/**
 * Tree Structure
 */
export class HttpInterceptorHandler implements HttpHandler {
  constructor(private _next: HttpHandler, private _interceptor: Interceptor) {}

  handle(request: Request<any>): Observable<HttpEvent<any>> {
    return this._interceptor.intercept(request, this._next);
  }
}


@Injectable()
export class HttpHandlerService implements HttpHandler {
  constructor(private _injector: Injector, private _backend: HttpBackend) {}

  handle(request: Request<any>): Observable<HttpEvent<any>> {
    const interceptors = this._injector.get(HTTP_INTERCEPTORS);
    /**
     * [interceptor1, interceptor2, interceptor3] ->
     * Register:
     * handler = XhrBackend ->
     * interceptor_handler1 = InterceptorHandler(handler, interceptor3) ->
     * interceptor_handler2 = InterceptorHandler(interceptor_handler1, interceptor2) ->
     * interceptor_handler3 = InterceptorHandler(interceptor_handler2, interceptor1) ->
     * interceptor_handler3.handle(request)
     *
     * Run:
     * interceptor_handler3.handle(request) ->
     * interceptor1.intercept(request, interceptor_handler2) ->
     * interceptor2.intercept(request, interceptor_handler1) ->
     * interceptor3.intercept(request, handler) ->
     * handler.handle(request)
     */
    const chain: HttpHandler = interceptors.reduceRight(
      (handler: HttpHandler, interceptor: Interceptor) => new HttpInterceptorHandler(handler, interceptor),
      this._backend
    );

    return chain.handle(request);
  }

}