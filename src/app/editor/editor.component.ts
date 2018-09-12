import { Component, OnInit, ViewChild, ElementRef, HostBinding } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { mergeMap } from 'rxjs/operators';

import * as SimpleMDE from 'simplemde';
import { fadeIn } from '../animations';
import { BlogService } from '../_services/blog.service';
import { ApiResult } from '../_models/ApiResult.model';
import { UtilService } from '../_services/util.service';
import { CategoryService } from '../_services/category.service';

@Component({
	templateUrl: './editor.component.html',
	styleUrls: ['./editor.component.scss'],
	animations: [fadeIn]
})
export class EditorComponent implements OnInit {
	@HostBinding('@fadeIn') fadeIn = true;
	@HostBinding('style.display') display = 'block';
	@ViewChild('simplemde')
	private textarea: ElementRef;
	private simplemde: SimpleMDE;

	id: string = ''; // 当前博客id
	title: string = ''; // 标题
	category: string = ''; // 分类
	newCategory: string = ''; // 创建的新分类
	categorys = []; // 分类列表
	tags = []; // 标签列表
	newTag: string = ''; //新标签

	constructor(
		private route: ActivatedRoute,
		private blogService: BlogService,
		private categoryService: CategoryService,
		private utilService: UtilService,
	) { }

	ngOnInit() {
		let config = {
			//initialValue: '',
			placeholder: '请开始在这里写你的东西吧！O(∩_∩)O ...',
			element: this.textarea.nativeElement,
			autoDownloadFontAwesome: false,
			spellChecker: false,
			showIcons: ["code", "table", "horizontal-rule", "strikethrough", "heading-smaller"
				, "heading-bigger", "heading-1", "heading-2", "heading-3"],
			previewRender: () => {
				return simplemde.markdown(simplemde.value());
			},
		}
		var simplemde = new SimpleMDE(config);
		this.simplemde = simplemde;
		simplemde.gui.sideBySide.className += ' markdown-body';

		const id = this.route.snapshot.paramMap.get('id');

		if (id) {
			this.id = id;
			this.blogService.getBlog(id).subscribe((result: ApiResult) => {
				if (result.error) {
					this.utilService.errorHandle(result.error);
					return;
				}

				const data = result.data;

				this.title = data.title;
				this.category = data.category._id;
				this.simplemde.value(data.blog);
				this.tags = data.tags;
			});
		}

		this.categoryService.getCategorys().subscribe((result: ApiResult) => {
			if (result.error) {
				this.utilService.errorHandle(result.error);
				return;
			}

			this.categorys = result.data;
		});
	}

	/**
	 * 提交统一处理
	 */
	public submitHandle(result: ApiResult) {
		if (result.error) {
			this.utilService.showTip(result.error);
		} else {
			this.title = '';
			this.simplemde.value('');
			this.category = '';
			this.newCategory = '';
			this.tags = [];
			this.utilService.showTip(result.message);
		}
	}

	/**
	 * 新建分类和博客
	 */
	newCategoryAndBlog(publish) {
		this.categoryService
			.addCategory({ name: this.newCategory })
			.pipe(
				mergeMap((result: ApiResult) => {
					return this.blogService.addBlog({
						title: this.title,
						category: result.data._id,
						blog: this.simplemde.value(),
						tags: this.tags,
						publish
					});
				})
			)
			.subscribe((result: ApiResult) => {
				this.submitHandle(result);
			});
	}

	/**
	 * 新建博客
	 */
	newBlog(publish) {
		this.blogService.addBlog({
			title: this.title,
			category: this.category,
			blog: this.simplemde.value(),
			tags: this.tags,
			publish
		}).subscribe((result: ApiResult) => {
			this.submitHandle(result);
		});
	}

	/**
	 * 添加分类，更新文章
	 */
	updateCategoryAndBlog(publish) {
		this.categoryService
			.addCategory({ name: this.newCategory })
			.pipe(
				mergeMap((result: ApiResult) => {
					return this.blogService.updateBlog(this.id, {
						title: this.title,
						category: result.data._id,
						blog: this.simplemde.value(),
						mtime: Date.now,
						tags: this.tags,
						publish
					});
				})
			)
			.subscribe((result: ApiResult) => {
				this.submitHandle(result);
			});
	}

	/**
	 * 更新文章
	 */
	updateBlog(publish) {
		this.blogService.updateBlog(this.id, {
			title: this.title,
			category: this.category,
			blog: this.simplemde.value(),
			tags: this.tags,
			publish
		}).subscribe((result: ApiResult) => {
			this.submitHandle(result);
		});
	}

	/**
	 * 保存
	 * @param publsh 是否发布
	 */
	save(publish: boolean = true) {
		if (!this.title) {
			this.utilService.showTip('还没写标题呢');
			return;
		}

		if (this.id) {
			if (this.newCategory) {
				this.updateCategoryAndBlog(publish);
			} else if (this.category) {
				this.updateBlog(publish);
			} else {
				this.utilService.showTip('还没选分类呢');
			}
			return;
		}

		if (this.newCategory) {
			this.newCategoryAndBlog(publish);
		} else if (this.category) {
			this.newBlog(publish);
		} else {
			this.utilService.showTip('还没选分类呢');
		}
	}

	/**
	 * 存为草稿，不发布
	 */
	draft() {
		this.save(false);
	}

	/**
	 * 增加标签
	 */
	addTag() {
		const newTag = this.newTag.trim();
		if (newTag !== '' && !this.tags.includes(newTag)) {
			this.tags.push(newTag);
			this.newTag = '';
		}
	}

	/**
	 * 删除标签
	 * @param tag 标签
	 */
	deleteTag(tag) {
		const index = this.tags.indexOf(tag);
		if (index !== -1) {
			this.tags.splice(index, 1);
		}
	}
}
