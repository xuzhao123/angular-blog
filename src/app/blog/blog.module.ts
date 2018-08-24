import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { BlogRoutingModule } from './blog-routing.module';
import { SideBarModule } from './side-bar/side-bar.module';
import { BlogComponent } from './blog.component';
import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleComponent } from './article/article.component';
import { ArchiveListComponent } from './archive-list/archive-list.component';


@NgModule({
  imports: [
    BrowserModule,
    SideBarModule,
    BlogRoutingModule
  ],
  declarations: [
    BlogComponent,
    ArticleListComponent,
    ArticleComponent,
    ArchiveListComponent
  ],
  providers: [],
})
export class BlogModule { }