import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((httpErrorRes) => {
        if (httpErrorRes.status === 401) {
          return throwError(httpErrorRes.statusText);
        }

        if (httpErrorRes instanceof HttpErrorResponse) {
          const applicationError = httpErrorRes.headers.get(
            'Application-Error'
          );
          if (applicationError) {
            return throwError(applicationError);
          }

          const serverError = httpErrorRes.error;
          let modelStateErrors = '';

          if (serverError.errors && typeof serverError.errors === 'object') {
            for (const key in serverError.errors) {
              if (serverError.errors[key]) {
                modelStateErrors += serverError.errors[key] + '\n';
              }
            }
          }
          return throwError(modelStateErrors || serverError || 'Server Error');
        }
      })
    );
  }
}

export const ErrorInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorInterceptor,
  multi: true,
};
