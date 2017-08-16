'use strict';

exports.__esModule = true;

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

require('./menu.less');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (app) {
    function stateGoFactory(scope, state) {
        return function (event) {
            if (scope.uiState && !scope.readonly) {
                event.preventDefault();
                event.stopPropagation();
                state.go(scope.uiState, scope.uiStateParam, scope.uiStateOpts);
                // state.go(scope.uiState, scope.uiStateParam, {
                //     reload: true,
                //     notify: false
                // });
                var ifr = document.querySelector('.iframe-wrap>cd-iframe>iframe');
                if (ifr && ifr.src !== ifr.contentWindow.location.href) {
                    ifr.src = ifr.src;
                }
            }
        };
    }

    app.directive('snMenu', [function () {
        var ctrl = function ctrl($scope, $state) {
            var menus = $scope.$menus = [];
            // 路由切换后，定位菜单是否被命中
            $scope.$on('router:state:change', function (evt, toState) {
                locateMenu(toState);
            });
            // 菜单变更后，定位菜单是否被命中
            $scope.$on('sn-menu:menu-change', function (evt) {
                locateMenu($state.current);
            });

            this.addMenu = function (menu) {
                menus.push(menu);
                locateMenu($state.current);
            };

            function locateMenu(toState) {
                var state = toState.name;
                for (var _iterator = menus, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);;) {
                    var _ref;

                    if (_isArray) {
                        if (_i >= _iterator.length) break;
                        _ref = _iterator[_i++];
                    } else {
                        _i = _iterator.next();
                        if (_i.done) break;
                        _ref = _i.value;
                    }

                    var menu = _ref;

                    menu.active = isMenuActive(menu, state);
                }
            }

            function isMenuActive(menu, state) {
                var active = false;
                var menuState = /.*(?=\()/.exec(menu.uiState);
                active = menu.uiState == state;
                if (!active && menu.relations) {
                    for (var _iterator2 = menu.relations, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : (0, _getIterator3.default)(_iterator2);;) {
                        var _ref2;

                        if (_isArray2) {
                            if (_i2 >= _iterator2.length) break;
                            _ref2 = _iterator2[_i2++];
                        } else {
                            _i2 = _iterator2.next();
                            if (_i2.done) break;
                            _ref2 = _i2.value;
                        }

                        var relation = _ref2;

                        active = active || (relation instanceof RegExp ? relation.test(state) : relation == state);
                    }
                };
                if (menu.children && menu.children.length > 0) {
                    active = menu.children.filter(function (item) {
                        return isMenuActive(item, state);
                    }).length || active;
                }
                menu.active = active;
                return active;
            }
        };
        ctrl.$inject = ['$scope', '$state'];

        var link = function link(scope, element, attrs) {
            element.addClass('sn-menu');
            // 如果是竖式菜单，并且包含主菜单标记main-menu，则需要监听事件，动态调整页面高度
            if (attrs.hasOwnProperty('mainMenu') && element.hasClass('vertical')) {
                scope.$on('router:state:change', function (evt, toState) {
                    if ($.AdminLTE) {
                        $.AdminLTE.layout.fix();
                        $.AdminLTE.layout.fixSidebar();
                    }
                });

                scope.$on('sn-menu:menu-change', function (evt) {
                    if ($.AdminLTE) {
                        $.AdminLTE.layout.fix();
                        $.AdminLTE.layout.fixSidebar();
                    }
                });
            }
        };
        return {
            restrict: 'AE',
            transclude: true,
            scope: true,
            controller: ctrl,
            link: link,
            template: '\n            <div class="navbar-menu">\n  <ul class="nav navbar-nav" ng-transclude></ul>\n</div>\n            '
        };
    }]);

    app.directive('snMenuItem', [function () {
        var ctrl = function ctrl($scope, $element, $timeout, $state) {
            $scope.children = [];
            this.addMenu = function (menu) {
                $scope.children.push(menu);
                $scope.$emit('sn-menu:menu-change');
            };
            var gotoState = $scope.gotoState = stateGoFactory($scope, $state);
            // 横向菜单的垂直2级菜单排布时，进行一些特殊处理
            var snMenu = $element.parent().parent().parent();
            if ($element.hasClass('vertical') && snMenu.hasClass('horizontal')) {
                $timeout(function () {
                    var ul = $element.find('> ul');
                    var liFirst = ul.find('> li:first-child');
                    var liList = ul.find('> li');
                    var ulist = ul.find('> li > ul');

                    // active样式控制
                    $element.mouseenter(function () {
                        liList.removeClass('active');
                        liFirst.addClass('active');
                    });
                    liList.mouseenter(function () {
                        liList.removeClass('active');
                        $(this).addClass('active');
                    });

                    // 计算容器高度 宽度
                    var maxHeight = Math.max.apply(null, (0, _from2.default)(ulist).map(function (item) {
                        return angular.element(item).height();
                    }).concat(ul.height()));
                    var maxWidth = Math.max.apply(null, (0, _from2.default)(ulist).map(function (item) {
                        return angular.element(item).width();
                    }));
                    // ul有border，占用2px的高度，所以+2补内容的高度
                    ul.height(maxHeight + 3);
                    ulist.height(maxHeight);
                    ulist.width(maxWidth);

                    // 右对齐特殊处理
                    if ($element.hasClass('right-align')) {
                        // jquery获取的宽度不包含margin、padding，这里根据less的设置进行补足
                        ul.css('right', maxWidth + 60);
                    }
                }, 0);
            }

            // 竖式菜单的1级菜单特殊处理
            if (snMenu.hasClass('vertical')) {
                var needCalcHeight = snMenu.attr('main-menu') !== undefined;
                $scope.gotoState = function (event) {
                    $scope.open = !$scope.open;
                    if (needCalcHeight && $.AdminLTE) {
                        $timeout(function () {
                            $.AdminLTE.layout.fix();
                            $.AdminLTE.layout.fixSidebar();
                        });
                    }
                    gotoState(event);
                };
            }
        };
        ctrl.$inject = ['$scope', '$element', '$timeout', '$state'];

        var link = function link(scope, element, attrs, snMenu, transcludeFn) {
            element.addClass('sn-menu-item');
            snMenu.addMenu(scope);
            scope.open = element.hasClass('open');
            var a = element.find('> a');
            a.append(element.find('> ul > t').remove());
            attrs.$observe('target', function (value) {
                a.attr('target', value);
            });
        };
        return {
            restrict: 'AE',
            transclude: true,
            replace: true,
            require: '^snMenu',
            scope: {
                href: '@',
                uiState: '@',
                readonly: '=',
                uiStateParam: '=',
                uiStateOpts: '=',
                relations: '='
            },
            controller: ctrl,
            compile: function compile(element, attrs, transcludeFn) {
                var parent = element.parent();
                if (parent.hasClass('horizontal')) {
                    element.addClass('dropdown');
                    element.find('> ul').addClass('dropdown-menu');
                }
                var a = element.find('> a');
                return {
                    post: link
                };
            },
            template: '<li ng-class="{\'active\': active, \'open\': open, \'readonly\': readonly,                     \'hasChildren\': children && children.length > 0 }">\n                            <a ng-click="gotoState($event)" ng-href="{{readonly ? \'\' : href}}">\n                                <i class="fa fa-angle-up pull-right" ng-show="children && children.length > 0 && !open"></i>\n                                <i class="fa fa-angle-down pull-right" ng-show="children && children.length > 0 && open"></i>\n                            </a>\n                            <ul ng-show="children && children.length > 0" ng-transclude></ul>\n                        </li>'
        };
    }]);

    app.directive('snMenuItem2', [function () {
        var ctrl = function ctrl($scope, $state) {
            $scope.children = [];
            this.addMenu = function (menu) {
                $scope.children.push(menu);
                $scope.$emit('sn-menu:menu-change');
            };
            $scope.gotoState = stateGoFactory($scope, $state);
        };
        ctrl.$inject = ['$scope', '$state'];

        var link = function link(scope, element, attrs, snMenuItem, transcludeFn) {
            element.addClass('sn-menu-item2');
            snMenuItem.addMenu(scope);
            var a = element.find('> a');
            a.append(element.find('> ul > t').remove());
            attrs.$observe('target', function (value) {
                a.attr('target', value);
            });
        };
        return {
            restrict: 'AE',
            transclude: true,
            replace: true,
            require: '^snMenuItem',
            scope: {
                href: '@',
                uiState: '@',
                readonly: '=',
                uiStateParam: '=',
                uiStateOpts: '=',
                relations: '='
            },
            controller: ctrl,
            compile: function compile(element, attrs, transcludeFn) {
                var a = element.find('a');
                return {
                    post: link
                };
            },
            template: '<li ng-class="{\'active\': active, \'readonly\': readonly, \'hasChildren\': children && children.length > 0 }">\n                            <a ng-click="gotoState($event)" ng-href="{{readonly ? \'\' : href}}">\n                                <i class="fa fa-angle-right pull-right"></i>\n                            </a>\n                            <hr>\n                            <ul ng-show="children && children.length > 0" ng-transclude></ul>\n                        </li>'
        };
    }]);

    app.directive('snMenuItem3', [function () {
        var ctrl = function ctrl($scope, $state) {
            $scope.gotoState = stateGoFactory($scope, $state);
        };
        ctrl.$inject = ['$scope', '$state'];

        var link = function link(scope, element, attrs, snMenuItem2, transcludeFn) {
            element.addClass('sn-menu-item3');
            snMenuItem2.addMenu(scope);
            var a = element.find('> a');
            a.append(element.find('> .menu3-detail > t').remove());
            attrs.$observe('target', function (value) {
                a.attr('target', value);
            });
        };

        return {
            restrict: 'AE',
            transclude: true,
            replace: true,
            require: '^snMenuItem2',
            scope: {
                href: '@',
                uiState: '@',
                readonly: '=',
                uiStateOpts: '=',
                uiStateParam: '=',
                relations: '='
            },
            controller: ctrl,
            link: link,
            template: '<li ng-class="{\'active\': active, \'readonly\': readonly}">\n                            <a ng-click="gotoState($event)" ng-href="{{readonly ? \'\' : href}}"></a>\n                            <div class="menu3-detail" ng-transclude></div>\n                        </li>'
        };
    }]);
};
//# sourceMappingURL=menu.js.map