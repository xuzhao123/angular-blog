import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

		if (request.method !== 'GET') {
			const token = JSON.parse(localStorage.getItem('token'));
			if (token) {
				request = request.clone({
					setHeaders: {
						Authorization: `Bearer ${token.token}`
					}
				});
			}
		}

		return next.handle(request);
	}
}
