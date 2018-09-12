import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiResult } from '../_models/ApiResult.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
	adminUrl: string = `/${environment.baseUrl}/admin`;

	redirectUrl = '';

	constructor(
		private http: HttpClient
	) { }

	login(username: string, password: string) {
		return this.http.post<any>(`${this.adminUrl}/login`, { username, password })
			.pipe(
				map((result: ApiResult) => {
					if (result.data) {
						localStorage.setItem('token', JSON.stringify(result.data));
					}
					return result;
				}));
	}

	logout() {
		localStorage.removeItem('token');
	}

	get isLoggedIn() {
		let isLoggedIn = false;
		const token: any = JSON.parse(localStorage.getItem('token'));
		if (token) {
			if (+new Date() < token.expires) {
				isLoggedIn = true;
			}
		}
		return isLoggedIn;
	}
}
