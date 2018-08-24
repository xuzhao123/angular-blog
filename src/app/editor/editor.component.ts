import { Component, OnInit, ViewChild, ElementRef, HostBinding } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { mergeMap } from 'rxjs/operators';

import * as SimpleMDE from 'simplemde';
import { fadeIn } from '../animations';
import { BlogService } from '../blog.service';
import { ApiResult } from '../common/ApiResult.model';
import { UtilService } from '../util.service';
import { CategoryService } from '../category.service';

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

    title: string = ''; // 标题
    category: string = ''; // 分类
    newCategory: string = ''; // 创建的新分类
    categorys = []; // 分类列表
    id: string = ''; // 当前博客id

    constructor(
        private route: ActivatedRoute,
        private blogService: BlogService,
        private categoryService: CategoryService,
        private utilService: UtilService,
    ) {

    }

    ngOnInit() {
        // this.route.paramMap.pipe(
        //     switchMap((params: ParamMap) => {
        //         return params.get('name');
        //     })
        // ).subscribe(name => {

        // });

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

                this.title = result.data.title;
                this.category = result.data.category._id;
                this.simplemde.value(result.data.blog);
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

    public submitHandle(result: ApiResult) {
        if (result.error) {
            this.utilService.showTip(result.error);
        } else {
			this.title = '';
			this.simplemde.value('');
            this.utilService.showTip(result.message);
        }
    }

    newCategoryAndBlog() {
        this.categoryService
            .addCategory({ name: this.newCategory })
            .pipe(
                mergeMap((result: ApiResult) => {
                    return this.blogService.addBlog({
                        title: this.title,
                        category: result.data._id,
                        blog: this.simplemde.value()
                    });
                })
            )
            .subscribe((result: ApiResult) => {
                this.submitHandle(result);
            });
    }

    newBlog() {
        this.blogService.addBlog({
            title: this.title,
            category: this.category,
            blog: this.simplemde.value()
        }).subscribe((result: ApiResult) => {
            this.submitHandle(result);
        });
    }

    updateCategoryAndBlog() {
        this.categoryService
            .addCategory({ name: this.newCategory })
            .pipe(
                mergeMap((result: ApiResult) => {
                    return this.blogService.updateBlog(this.id, {
                        title: this.title,
                        category: result.data._id,
                        blog: this.simplemde.value(),
                        mtime: Date.now
                    });
                })
            )
            .subscribe((result: ApiResult) => {
                this.submitHandle(result);
            });
    }

    updateBlog() {
        this.blogService.updateBlog(this.id, {
            title: this.title,
            category: this.category,
            blog: this.simplemde.value()
        }).subscribe((result: ApiResult) => {
            this.submitHandle(result);
        });
    }

    save() {
        if (!this.title) {
            this.utilService.showTip('还没写标题呢');
            return;
        }

        if (this.id) {
            if (this.newCategory) {
                this.updateCategoryAndBlog();
            } else if (this.category) {
                this.updateBlog();
            } else {
                this.utilService.showTip('还没选分类呢');
            }
            return;
        }

        if (this.newCategory) {
            this.newCategoryAndBlog();
        } else if (this.category) {
            this.newBlog();
        } else {
            this.utilService.showTip('还没选分类呢');
        }
    }
}
