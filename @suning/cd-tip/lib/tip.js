'use strict';

require('./tip.css');

module.exports = function (app, option) {
    app.directive('cdTip', [function () {
        return {
            restrict: 'A',
            scope: false,
            link: function link($scope, element, attrs) {
                var tpl = '<div class="sncd-ng-tip hidden"></div>';
                element[0].appendChild(document.createRange().createContextualFragment(tpl));
                var tip = element[0].querySelector('div.sncd-ng-tip');
                tip.addEventListener('mouseover', function (e) {
                    e.stopImmediatePropagation();
                });

                var show = true;
                element[0].addEventListener('mouseover', function (e) {
                    e.stopImmediatePropagation();
                    var els = document.querySelectorAll('div.sncd-ng-tip');
                    Array.prototype.forEach.call(els, function (e) {
                        e.classList.add('hidden');
                    });
                    if (show) {
                        var el = element[0].querySelector('div.sncd-ng-tip');
                        el.style.top = e.clientY + 'px';
                        if (attrs.last) {
                            el.style.right = 100 + 'px';
                        } else {
                            el.style.left = e.clientX + 'px';
                        }
                        el.textContent = element[0].childNodes[0].textContent;
                        el.classList.toggle('hidden');
                        show = !show;
                    } else {
                        show = !show;
                    }
                }, false);
                window.addEventListener('mouseover', function (e) {
                    var el = document.querySelectorAll('div.sncd-ng-tip');
                    Array.prototype.forEach.call(el, function (e) {
                        e.classList.add('hidden');
                    });
                    show = true;
                }, false);
                window.addEventListener('scroll', function (e) {
                    var el = document.querySelectorAll('div.sncd-ng-tip');
                    Array.prototype.forEach.call(el, function (e) {
                        e.classList.add('hidden');
                    });
                    show = true;
                }, false);
            }
        };
    }]);
};
//# sourceMappingURL=tip.js.map