import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiResult } from '../_models/ApiResult.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
	adminUrl: string = `/${environment.baseUrl}/admin`;

	isLoggedIn = false;

	redirectUrl = '';

	constructor(
		private http: HttpClient
	) {

	}

	login(username: string, password: string) {
		return this.http.post<any>(`${this.adminUrl}/login`, { username, password })
			.pipe(
				map((result: ApiResult) => {
					if (result.data) {
						this.isLoggedIn = true;
						localStorage.setItem('token', JSON.stringify(result.data.token));
					}
					return result;
				}));
	}

	logout() {
		this.isLoggedIn = false;
		localStorage.removeItem('token');
	}
}
