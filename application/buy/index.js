let page = 1, total = 0, bid = 0;
$(function () {
    loadBuy();
    document.activeElement.addEventListener('keydown', handleKeydown);
});
function loadBuy() {
    var url = 'https://manga.bilibili.com/twirp/user.v1.User/GetAutoBuyComics';
    var content = 'page_num=' + page + '&page_size=15';
    var result = $.postApi(url, content);
    if (result.code == 0) {
        var arr = result.data;
        if (arr != null && arr.length > 0) {
            for (var index = 0; index < arr.length; index++) {
                var desc = '', id = arr[index].comic_id;
                if (arr[index].styles != null && arr[index].styles.length > 0)
                    desc = arr[index].styles[0].name;
                var html = '<div class="item" tabIndex="' + total + '" data-id="' + id + '"><img src="' + arr[index].hcover + '@240w_148h.jpg" /><p class="title">' +
                    arr[index].comic_title + '</p><p class="desc">更新到' + arr[index].last_ord + '话</p><p class="desc">已购' + arr[index].bought_ep_count + '话</p></div>';
                $('.items').append(html);
                total++;
            }
        }
    }
    else {
        alert('获取购买数据失败！' + result.msg);
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
        case 'Enter': {
            page++;
            loadBuy();
            break;
        }
        case 'Q':
        case 'SoftLeft': {
            window.location.href = '../manga/index.html?bid=' + bid;
            break;
        }
        case 'E':
        case 'SoftRight':
        case 'Backspace':
            window.location.href = '../user/index.html';
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