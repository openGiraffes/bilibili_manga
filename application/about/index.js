$(function () {
    document.activeElement.addEventListener('keydown', handleKeydown);
});
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