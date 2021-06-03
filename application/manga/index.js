let id = 0, total = 0, epid = '', isFav = false;
$(function () {
    id = $.getQueryVar('bid');
    getInfo();
    document.activeElement.addEventListener('keydown', handleKeydown);
});
function getInfo() {
    var url = 'https://manga.bilibili.com/twirp/comic.v1.Comic/ComicDetail';
    var result = $.postApi(url, 'comic_id=' + id);
    if (result.code == 0) {
        var tags = '', author = '';
        if (result.data.styles2 != null) {
            for (var index = 0; index < result.data.styles2.length; index++)
                tags += (result.data.styles2[index].name + ',');
            tags = tags.substr(0, tags.length - 1);
        }
        isFav = (result.data.fav == 1);
        if (isFav)
            $('#softkey-center').text('已追');
        else
            $('#softkey-center').text('追漫');
        if (result.data.author_name != null)
            author = result.data.author_name.join(',');
        $('.info').show();
        $('#cover').attr('src', result.data.horizontal_cover + '@240w_148h.jpg');
        $('#title').text(result.data.title);
        $('#author').text(author);
        $('#tags').text(tags);
        $('#newest').text('更新到' + result.data.last_short_title + '话');
        $('#update').text(result.data.renewal_time);
        $('#desc').text(result.data.classic_lines);
        var eps = result.data.ep_list.sort(orderByShortTitle);
        var length = eps.length;
        for (var index = 0; index < length; index++) {
            var title = eps[index].title;
            if (!/[0-9]{1,}/.test(title))
                title = eps[index].short_title + '&nbsp;' + eps[index].title;
            var html = '<div class="item" tabIndex="' + total + '" data-id="' + eps[index].id + '">' + title + '</div>';
            $('.items').append(html);
            total++;
        }
    }
    else {
        alert('获取漫画详细失败！' + result.msg);
    }
}
function addFollow() {
    var url = 'https://manga.bilibili.com/twirp/bookshelf.v1.Bookshelf/AddFavorite';
    var content = 'comic_ids=' + id;
    var result = $.postApi(url, content);
    if (result.code == 0) {
        isFav = true;
        alert('追漫成功!');
        $('#softkey-center').text('已追');
    }
    else {
        alert('追漫失败！' + result.msg);
    }
}
function deleteFollow() {
    if (confirm('是否取消追漫？')) {
        var url = 'https://manga.bilibili.com/twirp/bookshelf.v1.Bookshelf/DeleteFavorite';
        var content = 'comic_ids=' + id;
        var result = $.postApi(url, content);
        if (result.code == 0) {
            isFav = false;
            alert('取消成功!');
            $('#softkey-center').text('追漫');
        }
        else {
            alert('取消失败！' + result.msg);
        }
    }
}
function orderByShortTitle(item1, item2) {
    var v1 = parseInt(item1.ord);
    var v2 = parseInt(item2.ord);
    if (v1 < v2)
        return 1;
    else if (v1 > v2)
        return -1;
    else
        return 0;
}
function load() {
    switch (tab_location) {
        case 0: {
            $('.info').show();
            $('.items').hide();
            $('#softkey-left').text('');
            break;
        }
        case 1: {
            $('.info').hide();
            $('.items').show();
            $('#softkey-left').text('选择');
            break;
        }
    }
}
function handleKeydown(e) {
    if (e.key != "EndCall")
        e.preventDefault();
    switch (e.key) {
        case 'ArrowUp':
            nav(-1);
            break;
        case 'ArrowDown':
            nav(1);
            break;
        case 'ArrowRight':
            tab(1);
            break;
        case 'ArrowLeft':
            tab(-1);
            break;
        case 'Q':
        case 'SoftLeft':
            if (tab_location == 1 && epid != '')
                window.location.href = '../ep/index.html?epid=' + epid + '&bid=' + id;
            break;
        case 'Enter': {
            if (isFav)
                deleteFollow();
            else
                addFollow();
            break;
        }
        case 'E':
        case 'SoftRight':
        case 'Backspace':
            window.location.href = '../index.html';
            break;
    }
}
var tab_location = 0;
function nav(move) {
    if (tab_location == 0) {
        var currentIndex = document.activeElement.tabIndex;
        var next = currentIndex + move;
        var items = document.querySelectorAll('.infoitem');
        var targetElement = items[next];
        if (targetElement) {
            $('.infoitem').removeClass('select');
            $(targetElement).addClass('select');
            targetElement.focus();
        }
        if (next == 0) {
            $('.info').scrollTop(0);
        }
    }
    else {
        var currentIndex = document.activeElement.tabIndex;
        var next = currentIndex + move;
        var items = document.querySelectorAll('.item');
        var targetElement = items[next];
        if (targetElement) {
            $('.item').removeClass('select');
            $(targetElement).addClass('select');
            epid = $(targetElement).attr('data-id');
            targetElement.focus();
        }
        if (next == 0) {
            $('.items').scrollTop(0);
        }
    }
}
function tab(move) {
    var currentIndex = parseInt($('.focus').attr('tabIndex'));
    var next = currentIndex + move;
    if (next > 2) next = 0;
    if (next < 0) next = 2;
    var items = document.querySelectorAll('li');
    var targetElement = items[next];
    if (targetElement) {
        $('.focus').attr("class", "");
        targetElement.className = "focus";
        tab_location = next;
        load();
    }
}