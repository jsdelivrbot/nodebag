import Pager from './pager'
export default function (app) {
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
                let pager = new Pager({
                    dom: element[0],
                    total: $scope.total,
                    pageSize: $scope.pageSize,
                    page: 1,
                    fn: $scope.pageAction
                })
                $scope.$watch('total', () => {
                    pager.reset({
                        page: $scope.page,
                        total: $scope.total,
                        pageSize: $scope.pageSize
                    })
                })
                $scope.$watch('pageSize', () => {
                    pager.reset({
                        page: $scope.page,
                        total: $scope.total,
                        pageSize: $scope.pageSize
                    })
                })
                $scope.$watch('page', () => {
                    pager.reset({
                        page: $scope.page,
                        total: $scope.total,
                        pageSize: $scope.pageSize
                    })
                })
            }
        };
    }]);
}