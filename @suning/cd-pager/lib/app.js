'use strict';

exports.__esModule = true;

exports.default = function (app) {
    app.directive('cdPager', [function () {
        return {
            restrict: 'E',
            scope: {
                page: '=',
                pageSize: '=',
                total: '=',
                pageAction: '&'
            },
            link: function link($scope, element, attrs) {
                var pager = new _pager2.default({
                    dom: element[0],
                    total: $scope.total,
                    pageSize: $scope.pageSize,
                    page: 1,
                    fn: $scope.pageAction
                });
                $scope.$watch('total', function () {
                    pager.reset({
                        page: $scope.page,
                        total: $scope.total,
                        pageSize: $scope.pageSize
                    });
                });
                $scope.$watch('pageSize', function () {
                    pager.reset({
                        page: $scope.page,
                        total: $scope.total,
                        pageSize: $scope.pageSize
                    });
                });
                $scope.$watch('page', function () {
                    pager.reset({
                        page: $scope.page,
                        total: $scope.total,
                        pageSize: $scope.pageSize
                    });
                });
            }
        };
    }]);
};

var _pager = require('./pager');

var _pager2 = _interopRequireDefault(_pager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=app.js.map