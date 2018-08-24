import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UtilService {

    tipEventEmitter = new EventEmitter();

    constructor() {
    }

    /**
     * 将时间字符串转化为时间格式
     * @param time
     * @returns {Date}
     */
    parseTime(time: any) {
        var regExp = /^\d{4}(\-|\/|\.)\d{1,2}\1\d{1,2}( \d{1,2}:\d{1,2}(:\d{1,2})?)?$/,
            partRegExp = /^\d{1,2}:\d{1,2}(:\d{1,2})?$/,
            now = new Date();
        if (regExp.test(time)) {
            time = time.replace(/-/g, "/");
            time = new Date(time);
        } else if (partRegExp.test(time)) {
            time = new Date(now.getFullYear() + '/' + now.getMonth() + '/' + now.getDate() + ' ' + time);
        } else {
            //1901-1-1
            time = new Date(1, 0, 1);
        }
        return time;
    };

    /**
     * 将时间转化为时间字符串
     * @param time
     * @param format
     * @returns {string}
     */
    stringifyTime(time: any, format: string) {
        format = format || 'yyyy-MM-dd hh:mm:ss';
        var o = {
            "M+": time.getMonth() + 1,
            "d+": time.getDate(),
            "h+": time.getHours(),
            "m+": time.getMinutes(),
            "s+": time.getSeconds(),
            "q+": Math.floor((time.getMonth() + 3) / 3),
            "S": time.getMilliseconds()
        };
        if (/(y+)/.test(format))
            format = format.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(format))
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        return format;
    };

    /**
     * 将字符串时间转化为字符串时间
     * @param time
     * @param format
     */
    convertTime(time: any, format: string) {
        if (time == '' || time == null) {
            return;
        }
        time = this.parseTime(time);
        if (time == null) {
            return;
        }
        return this.stringifyTime(time, format);
    };

    showTip(tip) {
        this.tipEventEmitter.emit(tip);
    };

    onTip() {
        return this.tipEventEmitter;
    };

    errorHandle(err) {
        this.showTip(err);
    }
}