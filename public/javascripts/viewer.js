/**
 * サブメニューをトグルする
 * 
 * @param {string} type - サブメニューのタイプ
 */
var activeSubMenu = '';
function toggleSubMenu(type) {
    if(type === activeSubMenu) {
        activeSubMenu = '';
        closeSubMenu();
    } else if(activeSubMenu === '') {
        activeSubMenu = type;
        openSubMenu(type);
    } else {
        activeSubMenu = type;
        var $subMenu = document.getElementById('subMenu');
        $subMenu.setAttribute('data-type', type);
    }
}

/**
 * サブメニューを開く
 */
function openSubMenu(type) {
    var $subMenu = document.getElementById('subMenu');
    $subMenu.classList.add('active');
    $subMenu.setAttribute('data-type', type);
}

/**
 * サブメニューを閉じる
 */
function closeSubMenu() {
    var $subMenu = document.getElementById('subMenu');
    $subMenu.classList.remove('active');
}