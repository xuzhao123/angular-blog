import { Injectable } from '@angular/core';
import { CanLoad, Router, Route } from '@angular/router';
import { AuthService } from '../_services/Auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanLoad {
	constructor(
		private authService: AuthService,
		private router: Router) {
	}

	canLoad(route: Route): boolean {
		if (this.authService.isLoggedIn) {
			return true;
		}

		this.authService.redirectUrl = route.path;

		this.router.navigate(['/login']);

		return false;
	}
}
