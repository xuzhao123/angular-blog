import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './common/not-found/not-found.component';

const routes: Routes = [
    {
        path: 'editor',
        loadChildren: './editor/editor.module#EditorModule',
        //data: { preload: true }
    },
    {
        path: 'admin',
        loadChildren: './admin/admin.module#AdminModule',
    },
    { path: '', redirectTo: '/blog', pathMatch: 'full' },
    { path: '**', component: NotFoundComponent },

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }