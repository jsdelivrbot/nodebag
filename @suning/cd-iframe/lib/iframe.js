'use strict';

module.exports = function (app, option) {
    app.directive('cdIframe', ['$sce', '$rootScope', function ($sce, $rootScope) {
        return {
            restrict: 'E',
            template: '<script>\n                function resizeIframe(obj) {\n                    window.cd_iframe_interval=setInterval(function(){\n                        obj.style.height = obj.contentWindow&&obj.contentWindow.document.body.clientHeight + "px";\n                    },100)\n                }\n            </script><iframe ng-show="url" src="{{url}}" width="100%" scrolling="no" style="border:0;min-height:100%;" onload="resizeIframe(this)"></iframe>',
            scope: {
                src: '@',
                bindSrc: '='
            },
            link: function link($scope, element, attrs) {
                $scope.url = $sce.trustAsResourceUrl($scope.src || $scope.bindSrc);
                $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                    clearInterval(window.cd_iframe_interval);
                });
                $scope.$watch('src', function () {
                    if ($scope.src) $scope.url = $sce.trustAsResourceUrl($scope.src);
                });
            }
        };
    }]);
};
//# sourceMappingURL=iframe.js.map