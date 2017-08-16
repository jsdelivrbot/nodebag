'use strict';

exports.__esModule = true;

exports.default = function (app) {
    (0, _menu2.default)(app);
    app.directive('cdNavbar', [function () {
        return {
            restrict: 'E',
            template: '\n                    <sn-menu class="vertical" main-menu="main-menu">\n                        <sn-menu-item ng-repeat="menu in menus track by $index" ui-state="{{menu.state}}" ui-state-param="menu.param" relations="menu1.relation" class="open">\n                            <t><i class="{{menu.icon}}"></i>{{menu.name}}</t>\n                            <sn-menu-item2 ng-repeat="menu2 in menu.children" ui-state="{{menu2.state}}" ui-state-param="menu2.param" relations="menu2.relation">\n                        <t>{{menu2.name}}</t>\n                            </sn-menu-item2>\n                        </sn-menu-item>\n                    </sn-menu>\n            ',
            scope: {
                menus: '='
            },
            link: function link($scope, element, attrs) {
                function setLeftHeight() {
                    var height = parseInt(window.getComputedStyle(element[0].parentNode).height);
                    element[0].style.height = height - 70 + 'px';
                }
                setLeftHeight();
                window.addEventListener('resize', setLeftHeight, false);
            }
        };
    }]);
};

var _menu = require('./menu');

var _menu2 = _interopRequireDefault(_menu);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=nav.js.map