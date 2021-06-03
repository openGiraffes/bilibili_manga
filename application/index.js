var menuOpen = false, total = 0, page = 1;
$(function () {
    load();
    document.activeElement.addEventListener('keydown', handleKeydown);
});
function load() {
    page = 1;
    total = 0;
    $('.items').empty();
    switch (tab_location) {
        case 0: {
            $('#softkey-left').text('搜索');
            $('#softkey-center').text('打开');
            $('#softkey-right').text('更多');
            loadSearch();
            break;
        }
        case 1: {
            $('#softkey-left').text('刷新');
            $('#softkey-center').text('打开');
            $('#softkey-right').text('选项');
            loadRecommand();
            break;
        }
        case 2: {
            $('#softkey-left').text('刷新');
            $('#softkey-center').text('打开');
            $('#softkey-right').text('选项');
            loadRank();
            break;
        }
        case 3: {
            $('#softkey-left').text('刷新');
            $('#softkey-center').text('打开');
            $('#softkey-right').text('选项');
            loadNew();
            break;
        }
        case 4: {
            $('#softkey-left').text('搜索');
            $('#softkey-center').text('下一个');
            $('#softkey-right').text('');
            loadTypeList();
            break;
        }
    }
}
function loadRank() {
    var url = 'https://manga.bilibili.com/twirp/comic.v1.Comic/HomeHot';
    var result = $.postApi(url, '');
    if (result.code == 0) {
        var arr = result.data;
        if (arr != null && arr.length > 0) {
            for (var index = 0; index < arr.length; index++) {
                var desc = '', id = arr[index].comic_id;
                if (arr[index].styles != null && arr[index].styles.length > 0)
                    desc = arr[index].styles[0].name;
                var html = '<div class="item" tabIndex="' + total + '" data-id="' + id + '"><img class="ver" src="' + arr[index].vertical_cover + '@240w_148h.jpg" /><p class="title">'
                    + arr[index].title + '</p><p class="desc">' + desc + '</p></div>';
                $('.items').append(html);
                total++;
            }
        }
    }
    else {
        alert('获取排行列表失败！' + result.message);
    }
}
function loadNew() {
    var url = 'https://manga.bilibili.com/twirp/comic.v1.Comic/ClassPage';
    var content = 'style_id=-1&area_id=-1&is_finish=-1&order=3&is_free=-1&page_num=1&page_size=20';
    var result = $.postApi(url, content);
    if (result.code == 0) {
        var arr = result.data;
        for (var index = 0; index < arr.length; index++) {
            var desc = '', id = arr[index].season_id;
            var html = '<div class="item" tabIndex="' + total + '" data-id="' + id + '"><img class="ver" src="' + arr[index].horizontal_cover + '@240w_148h.jpg" /><p class="title">'
                + arr[index].title + '</p><p class="desc">' + desc + '</p></div>';
            $('.items').append(html);
            total++;
        }
    }
    else {
        alert('获取新作列表失败！' + result.message);
    }
}
function loadRecommand() {
    var url = 'https://manga.bilibili.com/twirp/comic.v1.Comic/HomeRecommend';
    var contenmt = 'page_num=1&omit_cards=1&drag=0&new_fall_into_trap=0';
    var result = $.postApi(url, contenmt);
    if (result.code == 0) {
        var arr = result.data.list;
        if (arr != null && arr.length > 0) {
            for (var index = 0; index < arr.length; index++) {
                var desc = '', id = arr[index].comic_id;
                if (arr[index].styles != null && arr[index].styles.length > 0)
                    desc = arr[index].styles[0].name;
                var html = '<div class="item" tabIndex="' + total + '" data-id="' + id + '"><img src="' + arr[index].img + '@240w_148h.jpg" /><p class="title">' + arr[index].title
                    + '</p><p class="desc">' + desc + '</p></div>';
                $('.items').append(html);
                total++;
            }
        }
    }
    else {
        alert('获取热门推荐失败！' + result.message);
    }
}
function SoftLeft() {
    switch (tab_location) {
        case 0: {
            var keywords = $('#keywords').val();
            var url = 'https://manga.bilibili.com/twirp/comic.v1.Comic/Search';
            var content = 'key_word=' + encodeURIComponent(keywords) + '&page_num=' + page + '&page_size=20';
            var result = $.postApi(url, content);
            if (result.code == 0) {
                var arr = result.data.list;
                if (arr != null && arr.length > 0) {
                    for (var index = 0; index < arr.length; index++) {
                        var desc = '未知', id = arr[index].id;
                        if (arr[index].styles != null && arr[index].styles.length > 0)
                            desc = arr[index].is_finish == 0 ? '连载中' : '已完结';
                        var html = '<div class="item" tabIndex="' + total + '" data-id="' + id + '"><img src="' + arr[index].horizontal_cover + '@240w_148h.jpg" /><p class="title">'
                            + arr[index].title + '</p><p class="desc">' + desc + '</p></div>';
                        $('.items').append(html);
                        total++;
                    }
                }
            }
            else {
                alert('搜索失败！' + result.msg);
            }
            break;
        }
        case 1:
        case 2:
        case 3: {
            if (menuOpen) {
                var currentIndex = document.activeElement.tabIndex;
                switch (currentIndex) {
                    case 0:
                        window.location.href = '../user/index.html';
                        break;
                    case 1:
                        window.location.href = '../about/index.html';
                        break;
                    case 2: {
                        if (confirm('是否退出？'))
                            window.close();
                        break;
                    }
                }
            }
            else {
                load();
            }
            break;
        }
        case 4: {
            var rows = $('.rows');
            var condition = '';
            for (var index = 0; index < rows.length; index++) {
                var id = $(rows[index]).attr('data-id');
                var key = $(rows[index]).attr('data-key');
                if (typeof id == 'undefined') id = -1;
                condition += (key + '=' + id + '&');
            }
            window.location.href = '../list/index.html?' + condition.substr(0, condition.length - 1);
            break;
        }
    }
}
function selectType() {
    var child = $(document.activeElement).children();
    var index = $(document.activeElement).attr('data-index');
    var total = child.length;
    if (typeof index != 'undefined') {
        index = parseInt(index);
        index++;
    }
    else
        index = 0;
    if (index >= total) index = 0;
    $(child).removeClass('select');
    $(child[index]).addClass('select');
    var scrollLeft = $(child[index]).width() * index;
    document.activeElement.scroll(scrollLeft, 0);
    var id = $(child[index]).attr('data-id');
    $(document.activeElement).attr('data-id', id);
    $(document.activeElement).attr('data-index', index);
}
function loadSearch() {
    var html = '<input id="keywords" class="item" type="text" tabIndex="0" />';
    $('.items').append(html);
    total++;
}
function loadTypeList() {
    var url = 'https://manga.bilibili.com/twirp/comic.v1.Comic/AllLabel';
    var result = $.postApi(url, '');
    if (result.code == 0) {
        var areas = '<div class="rows item" data-key="area_id" tabIndex="0"><div data-id="-1" class="select">全部</div>';
        for (var index = 0; index < result.data.areas.length; index++) {
            var item = result.data.areas[index];
            areas += '<div data-id="' + item.id + '">' + item.name + '</div>';
        }
        $('.items').append(areas + '</div>');
        var orders = '<div class="rows item" data-key="order" tabIndex="1"><div data-id="-1" class="select">全部</div>';
        for (var index = 0; index < result.data.orders.length; index++) {
            var item = result.data.orders[index];
            orders += '<div data-id="' + item.id + '">' + item.name + '</div>';
        }
        $('.items').append(orders + '</div>');
        var prices = '<div class="rows item" data-key="is_free" tabIndex="2"><div data-id="-1" class="select">全部</div>';
        for (var index = 0; index < result.data.prices.length; index++) {
            var item = result.data.prices[index];
            prices += '<div data-id="' + item.id + '">' + item.name + '</div>';
        }
        $('.items').append(prices + '</div>');
        var status = '<div class="rows item" data-key="is_finish" tabIndex="3"><div data-id="-1" class="select">全部</div>';
        for (var index = 0; index < result.data.status.length; index++) {
            var item = result.data.status[index];
            status += '<div data-id="' + item.id + '">' + item.name + '</div>';
        }
        $('.items').append(status + '</div>');
        var styles = '<div class="rows item" data-key="style_id" tabIndex="4"><div data-id="-1" class="select">全部</div>';
        for (var index = 0; index < result.data.styles.length; index++) {
            var item = result.data.styles[index];
            styles += '<div data-id="' + item.id + '">' + item.name + '</div>';
        }
        $('.items').append(styles + '</div>');
    }
    else {
        alert('获取类别信息失败！' + result.msg);
    }
}
function SoftRight() {
    if (tab_location == 1 || tab_location == 2 || tab_location == 3) {
        if (!menuOpen) {
            menuOpen = true;
            $('#softkey-left').text('选择');
            $('#softkey-center').text('');
            $('#softkey-right').text('返回');
            $("#menu").css('display', 'block');
        }
        else {
            menuOpen = false;
            $('#softkey-left').text('刷新');
            $('#softkey-center').text('打开');
            $('#softkey-right').text('选项');
            $("#menu").css('display', 'none');
        }
    }
    else if (tab_location == 0) {
        if ($('#keywords').val() != '') {
            page++;
            SoftLeft();
        }
        else {
            alert('请输入关键字！');
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
        case 'Backspace':
            if (confirm('是否退出？'))
                window.close();
            break;
        case 'Enter': {
            if (!menuOpen) {
                if (tab_location == 4)
                    selectType();
                else if (typeof bid != 'undefined')
                    window.location.href = '../manga/index.html?bid=' + bid;
            }
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
var tab_location = 1;
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
function tab(move) {
    if (menuOpen === false) {
        var currentIndex = parseInt($('.focus').attr('tabIndex'));
        var next = currentIndex + move;
        if (next > 4) next = 0;
        if (next < 0) next = 4;
        var items = document.querySelectorAll('li');
        var targetElement = items[next];
        if (targetElement) {
            $('.focus').attr("class", "");
            targetElement.className = "focus";
            tab_location = next;
            load();
        }
    }
}