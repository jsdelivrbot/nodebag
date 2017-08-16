'use strict';

exports.__esModule = true;

exports.default = function (app) {
    app.directive('cdSel', [function () {
        return {
            restrict: 'E',
            template: '<select></select>',
            scope: {
                selData: '=',
                selSelected: '=',
                selEight: '&'
            },
            link: function link($scope, element, attrs) {
                var sel = new _select2.default({
                    dom: element[0].querySelector('select'),
                    config: {
                        multi: false,
                        selEight: $scope.selEight,
                        placeHolder: '请选择'
                    }
                });

                element[0].addEventListener('selectj:selected', function (e) {
                    $scope.$apply();
                });

                $scope.$watch('selData', function (newData, oldData) {
                    newData && sel.update({
                        data: newData
                    });
                });

                $scope.$watch('selSelected', function (newData, oldData) {
                    if (sel.selected_all === newData) return;
                    newData && sel.update({
                        data_sel: $scope.selSelected
                    });
                });
            }
        };
    }]);
    app.directive('cdSelMulti', [function () {
        return {
            restrict: 'E',
            template: '<div class="sel-mem">\n                            <div class="sel-mem-left">\n                                <div class="sel-pare">\n                                    <select>\n                                    </select>\n                                </div>\n                            </div>\n                            <div class="sel-mem-right">\n                                <span class="wrap" ng-repeat="d in selSelected">\n                                    <span class="wrap-name">{{d.text || d.name}}</span>\n                                    <i class="fa fa-times-circle" aria-hidden="true" ng-click="del(d)"></i>\n                                </span>\n                            </div>\n                        </div>',
            scope: {
                selData: '=',
                selSelected: '=',
                selEight: '&'
            },
            link: function link($scope, element, attrs) {
                var sel = new _select2.default({
                    dom: element[0].querySelector('.sel-pare select'),
                    config: {
                        multi: true,
                        selEight: $scope.selEight
                    }
                });

                element[0].addEventListener('selectj:selected', function (e) {
                    $scope.$apply();
                });

                $scope.del = function (d) {
                    for (var i = 0; i < $scope.selSelected.length; i++) {
                        if ($scope.selSelected[i].id === d.id) {
                            var len = $scope.selSelected.length - 1;
                            for (var j = i; j < len; j++) {
                                $scope.selSelected[j] = $scope.selSelected[j + 1];
                            }
                            $scope.selSelected.pop();
                        }
                    }
                };

                $scope.$watch('selData', function (newData, oldData) {
                    newData && sel.update({
                        data: newData
                    });
                });

                $scope.$watch('selSelected', function (newData, oldData) {
                    if (sel.selected_all === newData) return;
                    newData && sel.update({
                        data_sel: newData
                    });
                });
            }
        };
    }]);
};

var _select = require('./select');

var _select2 = _interopRequireDefault(_select);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=diSel.js.map