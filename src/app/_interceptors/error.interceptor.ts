import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../_services/Auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

	constructor(
		private authServer: AuthService,
		private router: Router
	) { }
	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

		return next.handle(request).pipe(
			catchError(err => {
				if (err.status === 401) {
					this.authServer.logout();
					this.router.navigate(['/login']);
				}

				const error = err.error.error || err.statusText;
				return throwError(error);
			}))
	}
}
