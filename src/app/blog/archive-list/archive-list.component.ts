import { Component, Input, OnInit, HostBinding } from '@angular/core';
import { BlogService } from '../../_services/blog.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { fadeIn } from '../../animations';
import { ApiResult } from '../../_models/ApiResult.model';
import { UtilService } from '../../_services/util.service';


@Component({
	templateUrl: './archive-list.component.html',
	styleUrls: ['./archive-list.component.scss'],
	animations: [fadeIn]
})
export class ArchiveListComponent implements OnInit {
	@HostBinding('@fadeIn') fadeIn = true;
	@HostBinding('style.display') display = 'block';

	categorys = [];

	constructor(
		private blogService: BlogService,
		private utilService: UtilService,
		private route: ActivatedRoute
	) {

	}

	private getCategorys(categoryId) {
		this.blogService.getBlogsByCategoryId(categoryId).subscribe((result: ApiResult) => {
			if (result.error) {
				this.utilService.errorHandle(result.error);
				return;
			}

			const categorys = {};
			result.data.forEach(d => {
				if (d.category) {
					categorys[d.category.name] = categorys[d.category.name] || {
						name: d.category.name,
						blogs: []
					}
					categorys[d.category.name].blogs.push({
						id: d._id,
						title: d.title,
						birthtime: d.birthtime
					});
				} else {
					categorys['其他'] = categorys['其他'] || {
						name: '其他',
						blogs: []
					};
					categorys['其他'].blogs.push({
						id: d._id,
						title: d.title,
						birthtime: d.birthtime
					});
				}
			});

			this.categorys = Object.keys(categorys).map(category => {
				return categorys[category];
			});
		});
	}

	ngOnInit() {
		this.route.paramMap.subscribe((params: ParamMap) => {
			const id = params.get('category');
			this.getCategorys(id);
		});
	}
}
