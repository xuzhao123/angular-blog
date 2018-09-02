import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, from } from 'rxjs';

import { UtilService } from './util.service';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    categryUrl: string = `/${environment.baseUrl}/category`;

    constructor(
        private http: HttpClient,
        private util: UtilService
    ) {

    }

    public getCategorys() {
        return this.http.get(`${this.categryUrl}`);
    }

    public addCategory(name) {
        return this.http.post(`${this.categryUrl}`, name)
    }
}
