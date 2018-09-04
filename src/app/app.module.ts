import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { BlogModule } from './blog/blog.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './common/header/header.component';
import { NotFoundComponent } from './common/not-found/not-found.component';
import { FooterComponent } from './common/footer/footer.component';
import { TipComponent } from './common/tip/tip.component';
import { LoginComponent } from './login/login.component';
import { JwtInterceptor } from './_interceptors/jwt.interceptor';
import { ErrorInterceptor } from './_interceptors/error.interceptor';
@NgModule({
	imports: [
		BrowserModule,
		FormsModule,
		HttpClientModule,
		BrowserAnimationsModule,

		BlogModule,
		AppRoutingModule
	],
	declarations: [
		AppComponent,
		HeaderComponent,
		FooterComponent,
		NotFoundComponent,
		TipComponent,
		LoginComponent
	],
	providers: [
		{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
		{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

		// provider used to create fake backend
		//fakeBackendProvider
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
