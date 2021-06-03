let userId = 0;
let isOpen = false, self = false;
$(function () {
    var mid = $.getQueryVar('mid');
    if (mid === false) {
        self = true;
        var id = $.getData('mid');
        if (typeof id != 'undefined' && id != null && id != '') {
            userId = parseInt(id);
            setUserInfo();
        }
        else {
            $('#softkey-left').text('登录');
            $(".login").show();
            $(".info").hide();
        }
    }
    else {
        var id = $.getData('mid');
        if (id == mid) {
            self = true;
            softkey("", "", "选项");
        }
        userId = mid;
        setUserInfo();
    }
    document.activeElement.addEventListener('keydown', handleKeydown);
});
function clockIn() {
    var id = $.getData('mid');
    if (id === false || id == '') {
        alert('未登录qaq~');
    }
    else {
        var info = $.postApi('https://manga.bilibili.com/twirp/activity.v1.Activity/GetClockInInfo', '')
        if (info.code == 0) {
            if (info.data.status == 0) {
                var index = info.data.day_count;
                var result = $.postApi('https://manga.bilibili.com/twirp/activity.v1.Activity/ClockIn', '');
                if (result.code == 0) {
                    var point = info.data.points[index];
                    alert('签到成功！获得' + point + '积分');
                }
                else {
                    alert('签到失败。' + result.msg);
                }
            }
            else {
                alert('签到过了qaq~');
            }
        }
        else {
            alert('获取签到信息失败.' + info.msg);
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
        case 'Q':
        case 'SoftLeft':
            if (!isOpen) {
                if (userId == 0)
                    login();
                else
                    logout();
            }
            else {
                navigate();
            }
            break;
        case 'Enter':
            if (!isOpen)
                window.location.href = '../index.html';
            break;
        case 'Backspace':
            window.location.href = '../index.html';
            break;
        case 'E':
        case 'SoftRight':
            showhideMenu();
            break;
    }
}
function navigate() {
    var item = $($('.menuitem')[menuIndex]).attr('data-tag');
    switch (item) {
        case 'ci':
            clockIn();
            break;
        case 'mf':
            window.location.href = '../follow/index.html';
            break;
        case 'hl':
            window.location.href = '../history/index.html';
            break;
        case 'bm':
            window.location.href = '../buy/index.html';
            break;
    }
}
function showhideMenu() {
    if (isOpen) {
        $("#menu").hide();
        softkey("登录", "主页", "选项");
        isOpen = false;
    }
    else {
        if (!self) {
            $('*[data-tag="at"]').hide();
            $('*[data-tag="ct"]').hide();
        }
        $("#menu").show();
        var items = document.querySelectorAll('.menuitem');
        items[0].focus();
        softkey("选择", "", "返回");
        isOpen = true;
    }
}
function softkey(left, center, right) {
    $('#softkey-left').text(left);
    $('#softkey-center').text(center);
    $('#softkey-right').text(right);
}
function logout() {
    if (confirm('确定注销？')) {
        userId = 0;
        $(".info").hide();
        $(".login").show();
        $('#softkey-left').text('登录');
        localStorage.removeItem('mid');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('expires_in');
        localStorage.removeItem('userInfo');
    }
}
var current = -1, menuIndex = 0;
function nav(move) {
    if (!isOpen) {
        var next = current + move;
        const items = document.querySelectorAll('.item');
        if (next >= items.length) {
            next = items.length - 1;
        }
        else if (next < 0) {
            next = 0;
        }
        const targetElement = items[next];
        if (targetElement) {
            current = next;
            targetElement.focus();
            $('.item').removeClass('select');
            $(targetElement).addClass('select');
        }
    }
    else {
        var next = menuIndex + move;
        var items = document.querySelectorAll('.menuitem');
        if (next >= items.length) {
            next = items.length - 1;
        }
        else if (next < 0) {
            next = 0;
        }
        const targetElement = items[next];
        if (targetElement) {
            menuIndex = next;
            targetElement.focus();
            $('.menuitem').removeClass('select');
            $(targetElement).addClass('select');
        }
    }
}
function login() {
    var name = $('#name').val();
    var pwd = $('#pwd').val();
    if (name == '' || pwd == '') {
        alert('账号或者密码不能为空！');
    }
    else {
        var passwd = encryptedPwd(pwd);
        var content = 'username=' + encodeURIComponent(name) + '&password=' + encodeURIComponent(passwd) + '&gee_type=10';
        var data = $.postApi('https://passport.bilibili.com/api/v3/oauth2/login', content, tv);
        if (data.code == 0) {
            var token = data.data.token_info;
            userId = token.mid;
            localStorage.setItem('mid', token.mid);
            localStorage.setItem('access_token', token.access_token);
            localStorage.setItem('refresh_token', token.refresh_token);
            localStorage.setItem('expires_in', (token.expires_in + $.getTs()));
            alert('登录成功！');
            $.getToken('#web');
            setUserInfo();
        }
        else {
            alert('登录失败！' + data.message);
        }
    }
}
function setUserInfo() {
    var userInfo = null;
    if (self)
        userInfo = $.getData('userInfo');
    if (typeof userInfo == 'undefined' || userInfo == null || userInfo == '') {
        var url = 'https://app.bilibili.com/x/v2/space?ps=10&vmid=' + userId;
        var result = $.getApi(url);
        userInfo = JSON.stringify(result);
    }
    var info = JSON.parse(userInfo);
    if (info != null) {
        $('#face').attr('src', info.data.card.face);
        $('#uid').text('UID ' + info.data.card.mid);
        $('#uname').text(info.data.card.name);
        $('#exp').text('经验 ' + info.data.card.level_info.current_exp + ' / ' + info.data.card.level_info.next_exp);
        $('#lv').text('LV ' + info.data.card.level_info.current_level);
        $('#focus').text(' 关注 ' + info.data.card.attention);
        $('#fans').text(' 粉丝 ' + info.data.card.fans);
        $('#sign').text(info.data.card.sign);
    }
    if (self) {
        localStorage.setItem('userInfo', userInfo);
        $('#softkey-left').text('注销');
    }
    $(".login").hide();
    $(".info").show();
}
function encryptedPwd(pwd) {
    var encrypted = pwd;
    var data = $.postApi("https://passport.bilibili.com/api/oauth2/getKey", '', android);
    if (data != null && data.code == 0) {
        var key = data.data.key;
        var hash = data.data.hash;
        key = key.replace(/\n/g, '').replace('-----BEGIN PUBLIC KEY-----', '').replace('-----END PUBLIC KEY-----', '');
        var decrypt = new JSEncrypt();
        decrypt.setPublicKey(key);
        var hashPass = hash.concat(pwd);
        encrypted = decrypt.encrypt(hashPass);
        if (typeof encrypted == 'boolean' && encrypted == false)
            encrypted = pwd;
    }
    return encrypted;
}
