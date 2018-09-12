import { Injectable } from '@angular/core';
import { CanLoad, Router, Route, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanLoad {
	constructor(
		private authService: AuthService,
		private router: Router) {
	}

	checkLogin(url) {
		if (this.authService.isLoggedIn) {
			return true;
		}

		this.authService.redirectUrl = url;

		this.router.navigate(['/login']);

		return false;
	}

	canLoad(route: Route): boolean {
		const url = `/${route.path}`;
		return this.checkLogin(url);
	}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		let url: string = state.url;
		return this.checkLogin(url);
	}
}
