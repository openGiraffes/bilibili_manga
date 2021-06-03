let id = 0, imgs = [], anchor = 0, total = 0, hasMore = true;
let scrollPosition = 0;
$(function () {
    id = $.getQueryVar('epid');
    loadData();
    window.onscroll = function () {
        var contentHeight = $('.items').height();
        scrollPosition = (document.documentElement.scrollTop || document.body.scrollTop) + window.innerHeight;
        if (scrollPosition * 1.2 >= contentHeight)
            getImageUrl();
    };
    document.activeElement.addEventListener('keydown', handleKeydown);
});
function loadData() {
    var url = 'https://manga.bilibili.com/twirp/comic.v1.Comic/GetImageIndex';
    var content = 'ep_id=' + id;
    var result = $.postApi(url, content);
    if (result.code == 0) {
        imgs = result.data.images;
        getImageUrl();
    }
    else if (result.code == 1) {
        if (confirm('需要购买此章节')) {
            var data = 'ep_id=' + id;
            var buyInfo = $.postApi('https://manga.bilibili.com/twirp/comic.v1.Comic/GetEpisodeBuyInfo', data);
            if (buyInfo.code == 0) {
                var pay = buyInfo.data.pay_gold;
                var cid = buyInfo.data.recommend_coupon_id;
                var remain = '剩余漫币:' + buyInfo.data.remain_gold + ';剩余漫读券：' + buyInfo.data.remain_coupon + ';剩余通用券：' + buyInfo.data.remain_silver +
                    '剩余限免卡：' + buyInfo.data.remain_item;
                buyEp(cid, pay, remain);
            }
            else
                alert('获取购买信息失败！' + buyInfo.msg);
        }
        else {
            var bid = $.getQueryVar('bid');
            window.location.href = '../manga/index.html?bid=' + bid;
        }
    }
    else {
        alert('获取漫画失败！' + result.msg);
    }
}
function buyEp(cid, pay, remain) {
    var text = prompt('请选择购买类型:0、返回 1、漫币 2、漫读券 3、通用券 4、限免卡 ( PS:' + remain + ')', '0');
    var content = '';
    switch (parseInt(text)) {
        case 0: {
            var bid = $.getQueryVar('bid');
            window.location.href = '../manga/index.html?bid=' + bid;
            return;
        }
        case 1:
            content = 'buy_method=3&ep_id=' + id + '&pay_amount=' + pay + '&auto_pay_gold_status=2';
            break;
        case 2:
            content = 'buy_method=2&auto_pay_gold_status=2&ep_id=' + id + '&coupon_id=' + cid;
            break;
        case 3:
            content = 'buy_method=5&ep_id=' + id;
            break;
        case 4:
            content = 'buy_method=4&auto_pay_gold_status=2&ep_id=' + id + '&coupon_id=' + cid;
            break;
        default: {
            alert('输入的格式不正确!');
            buyEp(cid, pay, remain);
            return;
        }
    }
    var url = 'https://manga.bilibili.com/twirp/comic.v1.Comic/BuyEpisode';
    var result = $.postApi(url, content);
    if (result.code == 0) {
        alert('购买成功！');
        loadData();
    }
    else {
        alert('购买失败！' + result.msg);
        buyEp(cid, pay, remain);
    }
}
function getImageUrl() {
    if (imgs.length > 0 && hasMore) {
        var url = 'https://manga.bilibili.com/twirp/comic.v1.Comic/ImageToken?device=pc&platform=web';
        var data = imgs.slice(anchor, 3 + anchor), urls = [];
        if (data.length > 0) {
            for (var index = 0; index < data.length; index++)
                urls.push(data[index].path);
            var content = { urls: JSON.stringify(urls) };
            var result = $.postWeb(url, content);
            if (result.code == 0) {
                var arr = result.data;
                if (arr != null) {
                    for (var rows = 0; rows < arr.length; rows++) {
                        var html = '<img class="item" tabIndex="' + total + '" src="' + arr[rows].url + '?token=' + arr[rows].token + '" />';
                        $('.items').append(html);
                        total++;
                    }
                }
            }
            anchor += 3;
        }
        else {
            hasMore = false;
        }
    }
}
function handleKeydown(e) {
    switch (e.key) {
        case 'E':
        case 'Backspace':
        case 'SoftRight':
            var bid = $.getQueryVar('bid');
            window.location.href = '../manga/index.html?bid=' + bid;
            break;
        case '2':
            page(-1);
            break;
        case '8':
            page(1);
            break;
        case '#':
            alert('按2、8键看上一页、下一页，按方向上下键滑动阅读。');
            break;
    }
}
function page(move) {
    var next = window.innerHeight * move;
    var scrollTo = scrollPosition + next;
    var contentHeight = $('.items').height();
    if (scrollTo >= 0 && scrollTo <= contentHeight) {
        $('.items').scrollTop(scrollTo);
        scrollPosition = scrollTo;
    }
}
function nav(move) {
    var currentIndex = document.activeElement.tabIndex;
    if (currentIndex + 1 == anchor)
        getImageUrl();
    var next = currentIndex + move;
    var items = document.querySelectorAll('.item');
    var targetElement = items[next];
    if (targetElement) {
        $('.item').removeClass('select');
        $(targetElement).addClass('select');
        targetElement.focus();
    }
    if (next == 0) {
        $('.items').scrollTop(0);
    }
}