import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './common/not-found/not-found.component';
import { AuthGuard } from './_guards/auth.guard';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
	{
		path: 'editor',
		loadChildren: './editor/editor.module#EditorModule',
		canLoad: [AuthGuard]
	},
	{
		path: 'admin',
		loadChildren: './admin/admin.module#AdminModule',
		canLoad: [AuthGuard]
	},
	{ path: 'login', component: LoginComponent },
	{ path: '', redirectTo: '/blog', pathMatch: 'full' },
	{ path: '**', component: NotFoundComponent },

];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
