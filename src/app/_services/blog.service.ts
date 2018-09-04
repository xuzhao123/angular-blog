import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, from } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class BlogService {
	blogUrl: string = `/${environment.baseUrl}/blog`;

	constructor(
		private http: HttpClient
	) {

	}

    /**
     * 添加博客
     * @param blog 博客内容
     */
	public addBlog(blog) {
		return this.http.post(`${this.blogUrl}`, blog);
	}

    /**
     * 获取博客
     */
	public getBlogs() {
		return this.http.get(`${this.blogUrl}`);
	}

	/**
	 * 获取单个博客
	 * @param id 博客id
	 */
	public getBlog(id) {
		return this.http.get(`${this.blogUrl}/${id}`);
	}

	/**
	 * 更新博客
	 * @param id 博客id
	 * @param blog 博客信息
	 */
	public updateBlog(id, blog) {
		return this.http.put(`${this.blogUrl}/${id}`, blog);
	}

    /**
     * 获取最近博客列表
     */
	public getRecentBlogs() {
		return this.http.get(`${this.blogUrl}/getRecentBlogs`);
	}

    /**
     * 根据分类ID获取博客信息
     * @param id 分类ID
     */
	public getBlogsByCategoryId(id) {
		return this.http.get(`${this.blogUrl}/getBlogsByCategoryId/${id ? id : ''}`);
	}

	/**
	 * 删除博客
	 * @param id
	 */
	public deleteBlog(id) {
		return this.http.delete(`${this.blogUrl}/${id}`);
	}

	/**
	 * 下载博客
	 */
	public downloadBlog() {
		return this.http.get(`${this.blogUrl}/exportMarkdown`);
	}
}
