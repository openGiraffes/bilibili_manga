let page = 1, total = 0, menuOpen = false, bid = 0;
$(function () {
    loadHistroy();
    document.activeElement.addEventListener('keydown', handleKeydown);
});
function loadHistroy() {
    var url = 'https://manga.bilibili.com/twirp/bookshelf.v1.Bookshelf/ListHistory';
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
                    arr[index].title + '</p><p class="desc">看到&nbsp;' + arr[index].last_ep_short_title + '&nbsp;/&nbsp;' + arr[index].latest_ep_short_title + '</p></div>';
                $('.items').append(html);
                total++;
            }
        }
    }
    else {
        alert('获取追漫失败！' + result.message);
    }
}
function SoftLeft() {
    if (menuOpen) {
        var currentIndex = document.activeElement.tabIndex;
        switch (currentIndex) {
            case 0: {
                var url = 'https://manga.bilibili.com/twirp/bookshelf.v1.Bookshelf/DeleteHistory';
                var content = 'comic_ids=' + bid;
                var result = $.postApi(url, content);
                if (result.code == 0)
                    alert('删除记录成功！');
                else
                    alert('删除记录失败！' + result.msg);
                break;
            }
            case 1: {
                window.location.href = '../user/index.html';
                break;
            }
        }
    }
    else {
        window.location.href = '../manga/index.html?bid=' + bid;
    }
}
function SoftRight() {
    if (!menuOpen) {
        menuOpen = true;
        $('#softkey-left').text('选择');
        $('#softkey-center').text('');
        $('#softkey-right').text('返回');
        $("#menu").css('display', 'block');
    }
    else {
        menuOpen = false;
        $('#softkey-left').text('选择');
        $('#softkey-center').text('');
        $('#softkey-right').text('选项');
        $("#menu").css('display', 'none');
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
        case 'Backspace':
            window.location.href = '../user/index.html';
            break;
        case 'Enter': {
            page++;
            loadHistroy();
            break;
        }
        case 'Q':
        case 'SoftLeft':
            SoftLeft();
            break;
        case 'E':
        case 'SoftRight':
            SoftRight();
            break;
    }
}
function nav(move) {
    if (menuOpen === true) {
        var currentIndex = document.activeElement.tabIndex;
        var menulength = document.querySelectorAll('.menuitem').length;
        var next = currentIndex + move;
        if (next < 0)
            next = menulength - 1;
        else if (next >= menulength)
            next = 0;
        var items = document.querySelectorAll('.menuitem');
        var targetElement = items[next];
        if (targetElement) {
            targetElement.focus();
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
            bid = $(targetElement).attr('data-id');
            targetElement.focus();
        }
        if (next == 0) {
            $('.items').scrollTop(0);
        }
    }
}