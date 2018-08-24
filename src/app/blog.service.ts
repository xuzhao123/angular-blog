import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, from } from 'rxjs';

import { environment } from '../environments/environment';

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
		return this.http.post(`${this.blogUrl}/add`, blog);
	}

    /**
     * 获取博客
     */
	public getBlogs() {
		return this.http.get(`${this.blogUrl}/list`);
	}

	/**
	 * 获取单个博客
	 * @param id 博客id
	 */
	public getBlog(id) {
		return this.http.get(`${this.blogUrl}/get`, { params: { id } });
	}

	/**
	 * 更新博客
	 * @param id 博客id
	 * @param blog 博客信息
	 */
	public updateBlog(id, blog) {
		return this.http.put(`${this.blogUrl}/update`, blog, { params: { id } });
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
		const options: {
			params?: { id }
		} = {};
		if (id) {
			options.params = { id };
		}
		return this.http.get(`${this.blogUrl}/getBlogsByCategoryId`, options);
	}

	/**
	 * 删除博客
	 * @param id
	 */
	public deleteBlog(id) {
		return this.http.delete(`${this.blogUrl}/delete`, { params: { id } });
	}

	/**
	 * 下载博客
	 */
	public downloadBlog() {
		return this.http.get(`${this.blogUrl}/exportMarkdown`);
	}
}
