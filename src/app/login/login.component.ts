import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/Auth.service';
import { Router } from '@angular/router';
import { UtilService } from '../_services/util.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
	username = '';
	password = '';

	error = '';
	loading = false;
	constructor(
		private authService: AuthService,
		private utilService: UtilService,
		private router: Router,
	) { }

	ngOnInit() {
		this.authService.logout();
	}

	onSubmit() {
		this.authService.login(this.username, this.password).subscribe(
			data => {
				this.router.navigate([this.authService.redirectUrl]);
			},
			error => {
				this.error = error;
				debugger
				this.utilService.showTip(error);
				this.loading = false;
			});
	}

}
