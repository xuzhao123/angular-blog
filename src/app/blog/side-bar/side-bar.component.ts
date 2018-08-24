import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../blog.service';
import { UtilService } from '../../util.service';
import { ApiResult } from '../../common/ApiResult.model';
import { CategoryService } from '../../category.service';

@Component({
    selector: 'app-side-bar',
    templateUrl: './side-bar.component.html',
    styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {
    archives = [];
    recentPosts = [];

    constructor(
        private blogService: BlogService,
        private categoryService: CategoryService,
        private utilService: UtilService
    ) {

    }

    ngOnInit() {
        this.blogService.getRecentBlogs().subscribe((result: ApiResult) => {
            if (result.error) {
                this.utilService.errorHandle(result.error);
                return;
            }
            this.recentPosts = result.data.map(data => {
                return {
                    name: data.title,
                    href: `./article/${data._id}`
                }
            });
        });

        this.categoryService.getCategorys().subscribe((result: ApiResult) => {
            if (result.error) {
                this.utilService.errorHandle(result.error);
                return;
            }
            this.archives = result.data.map(data => {
                return {
                    name: data.name,
                    href: `./archives/${data._id}`
                }
            });
        });
    }
}