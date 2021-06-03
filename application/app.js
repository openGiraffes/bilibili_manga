const version = '3.0.0';
const android = {
    key: '1d8b6e7d45233436',
    secret: '560c52ccd288fed045859ed18bffd973'
};
const tv = {
    key: '4409e2ce8ffd12b8',
    secret: '59b43e04ad6965f34319062b478f83dd'
};
$.extend({
    initApi: function () {
        $.ajaxSettings.xhr = function () {
            try {
                return new XMLHttpRequest({ mozSystem: true });
            } catch (e) { }
        };
    },
    postWeb: function (url, content) {
        var json = null;
        $.ajax({
            url: url,
            data: content,
            type: 'post',
            async: false,
            beforeSend: function (request) {
                $.showLoading();
                request.setRequestHeader("user-agent", "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Mobile Safari/537.36")
            },
            success: function (data) {
                json = data;
            },
            error: function (xhr) {
                json = xhr.responseJSON;
            },
            complete: function () {
                $.hideLoading();
            }
        });
        return json;
    },
    postApi: function (url, content, keyValue) {
        var json = null;
        if (keyValue == undefined || keyValue == null || typeof keyValue == 'undefined')
            keyValue = android;
        var access_token = this.getData('access_token');
        content += '&access_key=' + access_token + '&appkey=' + keyValue.key + '&mobi_app=android_comic&device=android&version=' + version + '&actionKey=appkey&platform=android&ts=' + this.getTs()
            + '&buvid=3168fe38e580b16a02c2cc9beceaf6b7infoc';
        content += "&sign=" + this.getSign(content, keyValue.secret);
        $.ajax({
            url: url,
            data: content,
            type: 'post',
            async: false,
            beforeSend: function (request) {
                $.showLoading();
                request.setRequestHeader("user-agent", "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Mobile Safari/537.36")
            },
            success: function (data) {
                json = data;
            },
            error: function (xhr) {
                json = xhr.responseJSON;
            },
            complete: function () {
                $.hideLoading();
            }
        });
        return json;
    },
    getApi: function (url, keyValue) {
        var json = null;
        if (keyValue == undefined || keyValue == null || typeof keyValue == 'undefined')
            keyValue = android;
        var access_token = this.getData('access_token');
        if (url.indexOf('?') > -1)
            url += '&access_key=' + access_token + '&appkey=' + keyValue.key + '&platform=android&device=android&actionKey=appkey&build=5442100&mobi_app=android_comic&ts=' + this.getTs();
        else
            url += '?access_key=' + access_token + '&appkey=' + keyValue.key + '&platform=android&device=android&actionKey=appkey&build=5442100&mobi_app=android_comic&ts=' + this.getTs();
        url += "&sign=" + this.getSign(url, keyValue.secret);
        $.ajax({
            url: url,
            type: "get",
            async: false,
            beforeSend: function (request) {
                $.showLoading();
                request.setRequestHeader("user-agent", "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Mobile Safari/537.36")
            },
            success: function (data) {
                json = data;
            },
            error: function (xhr) {
                json = xhr.responseJSON;
            },
            complete: function () {
                $.hideLoading();
            }
        });
        return json;
    },
    getToken: function (elementId) {
        var access_token = this.getData('access_token');
        var url = 'https://passport.bilibili.com/api/login/sso?access_key=' + access_token + '&appkey=' + android.key +
            '&build=5442100&gourl=https%3A%2F%2Faccount.bilibili.com%2Faccount%2Fhome&mobi_app=android&platform=android&ts=' + this.getTs();
        url += "&sign=" + this.getSign(url, android.secret);
        $(elementId).attr('src', url);
    },
    getSign: function (url, secret) {
        if (typeof secret == 'undefined')
            secret = android.Secret;
        var str = url.substring(url.indexOf("?", 4) + 1);
        var list = str.split('&');
        list.sort();
        var stringBuilder = '';
        for (var index = 0; index < list.length; index++) {
            stringBuilder += (stringBuilder.length > 0 ? '&' : '');
            stringBuilder += list[index];
        }
        stringBuilder += secret;
        var result = stringBuilder;
        result = md5(stringBuilder);
        return result.toLowerCase();
    },
    getTs: function () {
        var ts = new Date().getTime().toString();
        if (ts.length > 10)
            ts = ts.substring(0, 10);
        return ts;
    },
    getData: function (key) {
        try {
            var value = localStorage.getItem(key);
            if (value == undefined || typeof value == 'undefined' || value == null)
                value = '';
            return value;
        }
        catch (e) {
            console.log(e);
        }
        return '';
    },
    getQueryVar: function (variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) { return pair[1]; }
        }
        return (false);
    }
});

$(function () {
    $.initApi();
});