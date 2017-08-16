'use strict';

exports.__esModule = true;
exports.dialogDrag = dialogDrag;
var $document = $(document.documentElement);

function dialogDrag() {
    // 只有头可以拖动，切弹窗口
    var startX = 0,
        startY = 0,
        x = 0,
        y = 0;

    return function (element) {

        function mousemove(event) {
            y = event.screenY - startY;
            x = event.screenX - startX;
            element.find('.modal-dialog').css({
                top: y + 'px',
                left: x + 'px'
            });
        }

        function mouseup() {
            $document.unbind('mousemove', mousemove);
            $document.unbind('mouseup', mouseup);
            element.find('.modal-header').css({
                cursor: 'default'
            });
        }

        element.find('.modal-header').bind('mousedown', function (event) {
            // 模态框与鼠标的偏移
            startX = event.screenX - x;
            startY = event.screenY - y;
            $document.bind('mousemove', mousemove);
            $document.bind('mouseup', mouseup);
            element.find('.modal-header').css({
                cursor: 'move'
            });
        });
    };
}
//# sourceMappingURL=dialogDrag.js.map