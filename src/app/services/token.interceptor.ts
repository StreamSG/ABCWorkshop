import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * HttpInterceptor for adding JWT token to outgoing requests.
 * @class
 */
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  /**
   * @constructor
   */
  constructor() {}

  /**
   * Interceptor method. Adds the JWT token from local storage to the request headers.
   * @param {HttpRequest<unknown>} request - The outgoing request.
   * @param {HttpHandler} next - The next middleware in the chain.
   * @returns An Observable of the (possibly transformed) HTTP response.
   */
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let token = localStorage.getItem('access_token');
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request);
  }
}
