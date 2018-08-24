import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogComponent } from './blog.component';
import { ArticleListComponent } from './article-list/article-list.component';
import { ArchiveListComponent } from './archive-list/archive-list.component';
import { ArticleComponent } from './article/article.component';

const routes: Routes = [
    {
        path: 'blog',
        component: BlogComponent,
        children: [
            {
                path: 'article/:id',
                component: ArticleComponent
            },
            {
                path: 'archives',
                component: ArchiveListComponent
            },
            {
                path: 'archives/:category',
                component: ArchiveListComponent
            },
            {
                path: '',
                component: ArticleListComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BlogRoutingModule { }