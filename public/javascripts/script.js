/**
 * ポイントチャージのinputにポイントを追加
 * @param {number} point - 追加するポイント
 */
function pointChargeAdd(point) {
    var $elem = document.getElementById('pointChargeInput');
    if($elem) {
        var val = +$elem.value;
        $elem.value = val + point;
        pointChargeInputChange();
    }
}

function pointChargeInputChange() {
    var $elem = document.getElementById('pointChargeInput');
    if($elem) {
        var val = +$elem.value;
        var $before = document.getElementById('pointChargeBefore');
        var before = +$before.getAttribute('data-point');
        var $result = document.getElementById('pointChargeResult');
        var result = val + before;
        $result.innerHTML = result + 'pt';
        if(result >= 0) {
            $result.classList.remove('danger');
            $result.classList.add('success');
        } else {
            $result.classList.remove('success');
            $result.classList.add('danger');
        }
    }
}

pointChargeInputChange();