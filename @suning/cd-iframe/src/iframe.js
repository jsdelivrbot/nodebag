module.exports = function (app, option) {
    app.directive('cdIframe', ['$sce', '$rootScope', ($sce, $rootScope) => {
        return {
            restrict: 'E',
            template: `<script>
                function resizeIframe(obj) {
                    window.cd_iframe_interval=setInterval(function(){
                        obj.style.height = obj.contentWindow&&obj.contentWindow.document.body.clientHeight + "px";
                    },100)
                }
            </script><iframe ng-show="url" src="{{url}}" width="100%" scrolling="no" style="border:0;min-height:100%;" onload="resizeIframe(this)"></iframe>`,
            scope: {
                src: '@',
                bindSrc: '='
            },
            link: function link($scope, element, attrs) {
                $scope.url = $sce.trustAsResourceUrl($scope.src || $scope.bindSrc);
                $rootScope.$on('$stateChangeSuccess',
                    function (event, toState, toParams, fromState, fromParams) {
                        clearInterval(window.cd_iframe_interval)
                    })
                $scope.$watch('src', () => {
                    if ($scope.src)
                        $scope.url = $sce.trustAsResourceUrl($scope.src);
                })
            }
        }
    }])
}