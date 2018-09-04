import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { switchMap } from 'rxjs/operators';

import * as MD from 'markdown-it';
import * as mdAbbr from 'markdown-it-abbr';
import * as mdContainer from 'markdown-it-container';
import * as mdDeflist from 'markdown-it-deflist';
import * as mdEmoji from 'markdown-it-emoji';
import * as mdFootnote from 'markdown-it-footnote';
import * as mdIns from 'markdown-it-ins';
import * as mdMark from 'markdown-it-mark';
import * as mdSub from 'markdown-it-sub';
import * as mdSup from 'markdown-it-sup';
import * as mdHl from 'markdown-it-highlightjs';

import { Article } from '../../_models/ariticle.model';
import { BlogService } from '../../_services/blog.service';
import { ApiResult } from '../../_models/ApiResult.model';
import { UtilService } from '../../_services/util.service';

const md = MD();
md.use(mdAbbr).use(mdContainer).use(mdDeflist).use(mdEmoji).use(mdFootnote).use(mdIns).use(mdMark).use(mdSub).use(mdSup).use(mdHl);

enum ArticleType {
	pre = 'pre',
	all = 'all'
}

@Component({
	selector: 'app-article',
	templateUrl: './article.component.html',
	styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {

	@Input() article: Article;
	html: SafeHtml;
	type: ArticleType = ArticleType.all;

	constructor(
		private blogService: BlogService,
		private utilService: UtilService,
		private sanitize: DomSanitizer,
		private route: ActivatedRoute
	) {

	}

	private parseMarkdown(data: string): string {
		data = data.replace(/^#\s{1}\S*\s{2,4}/, '');
		return md.render(data);
	}

	private getForeWord(data: string): string {
		if (/[\s\S]+## 前言\s\s\S+/.test(data)) {
			return /[\s\S]+## 前言\s\s\S+/.exec(data)[0];
		} else {
			return data.substr(0, 250) + (data.length > 250 ? '...' : '');
		}
	}

	private async getBlog(article: Article, fore: boolean = false) {
		let data = article.blog;
		if (!data) {
			return;
		}

		if (fore) {
			data = this.getForeWord(data);
		}
		data = this.parseMarkdown(data)
		this.html = this.sanitize.bypassSecurityTrustHtml(data);
	}

	async ngOnInit() {
		if (this.article) {
			this.type = ArticleType.pre;
			this.getBlog(this.article, true);
		} else {
			this.route.paramMap.subscribe((params: ParamMap) => {
				const id = params.get('id');

				this.blogService.getBlog(id).subscribe((result: ApiResult) => {
					if (result.error) {
						this.utilService.errorHandle(result.error);
						return;
					}

					this.article = result.data;
					this.getBlog(this.article);
				});
			});
		}
	}
}
