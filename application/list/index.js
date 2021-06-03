let page = 1, total = 0, bid = 0;
$(function () {
    loadData();
    document.activeElement.addEventListener('keydown', handleKeydown);
});
function loadData() {
    var order = $.getQueryVar('order');
    var area_id = $.getQueryVar('area_id');
    var is_free = $.getQueryVar('is_free');
    var style_id = $.getQueryVar('style_id');
    var is_finish = $.getQueryVar('is_finish');
    var url = 'https://manga.bilibili.com/twirp/comic.v1.Comic/ClassPage';
    var content = 'style_id=' + style_id + '&area_id=' + area_id + '&is_finish=' + is_free + '&order=' + order + '&is_free=' + is_finish + '&page_num=' + page + '&page_size=15';
    var result = $.postApi(url, content);
    if (result.code == 0) {
        var arr = result.data;
        if (arr != null && arr.length > 0) {
            for (var index = 0; index < arr.length; index++) {
                var desc = '', id = arr[index].season_id;
                if (arr[index].styles != null && arr[index].styles.length > 0)
                    desc = arr[index].styles[0].name;
                var html = '<div class="item" tabIndex="' + total + '" data-id="' + id + '"><img src="' + arr[index].horizontal_cover + '@240w_148h.jpg" /><p class="title">' +
                    arr[index].title + '</p><p class="desc">更新至&nbsp;' + arr[index].last_ord + '&nbsp;话</p></div>';
                $('.items').append(html);
                total++;
            }
        }
    }
    else {
        alert('获取列表数据失败！' + result.msg);
    }
}
function SoftLeft() {
    window.location.href = '../manga/index.html?bid=' + bid;
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
        case 'Enter': {
            page++;
            loadData();
            break;
        }
        case 'Q':
        case 'SoftLeft':
            SoftLeft();
            break;
        case 'E':
        case 'SoftRight':
        case 'Backspace':
            window.location.href = '../index.html';
            break;
    }
}
function nav(move) {
    var currentIndex = document.activeElement.tabIndex;
    var next = currentIndex + move;
    var items = document.querySelectorAll('.item');
    var targetElement = items[next];
    if (targetElement) {
        $('.item').removeClass('select');
        $(targetElement).addClass('select');
        bid = $(targetElement).attr('data-id');
        targetElement.focus();
    }
    if (next == 0) {
        $('.items').scrollTop(0);
    }
}