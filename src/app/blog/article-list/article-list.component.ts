import { Component, OnInit, HostBinding } from '@angular/core';
import { Article } from '../../_models/ariticle.model';
import { BlogService } from '../../_services/blog.service';
import { fadeIn } from '../../animations';
import { ApiResult } from '../../_models/ApiResult.model';
import { UtilService } from '../../_services/util.service';

@Component({
	selector: 'app-article-list',
	templateUrl: './article-list.component.html',
	styleUrls: ['./article-list.component.scss'],
	animations: [fadeIn]
})
export class ArticleListComponent implements OnInit {
	@HostBinding('@fadeIn') fadeIn = true;
	@HostBinding('style.display') display = 'block';

	list: Article[] = [];

	constructor(
		private blogService: BlogService,
		private utilService: UtilService
	) {

	}

	private getArticleList(data) {
		// 可以做一些简单的处理
		return data;
	}

	ngOnInit() {
		this.blogService.getBlogs().subscribe((result: ApiResult) => {
			if (result.error) {
				this.utilService.errorHandle(result.error);
				return;
			}
			this.list = this.getArticleList(result.data);
		});
	}
}
