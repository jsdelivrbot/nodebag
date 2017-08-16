'use strict';

exports.__esModule = true;
var step1 = '\n<div class="stepS1">\n\t<ul class="clearfix">\n\t\t<li ng-repeat="name in stepName" ng-click="curr($index)">\n\t\t\t<div class="cir" ng-class="{act0: $index == currentStep, act1: $index < currentStep}">\n\t\t\t\t<span ng-hide="$index < currentStep" ng-bind="$index+1"></span>\n\t\t\t\t<div class="text" ng-class="{act3: $index <= currentStep}" ng-bind="name"></div>\n\t\t\t</div>\n\t\t\t<div class="lineDef" ng-if="!$last"><div ng-style="{width: $index<currentStep ? \'100%\' : \'0\'}"></div></div>\t\t\t\n\t\t</li>\t\n\t</ul>\n</div>\t\t';
var step2 = '\n<div class="stepS2">\n\t<ul class="clearfix">\n\t\t<li ng-class="{act:$index <= currentStep}" ng-repeat="name in stepName" ng-bind="name" ng-click="curr($index)"></li>\t\t\t\n\t</ul>\n</div>\t\t';

exports.default = function (app) {
    app.directive('snStep', ['$http', function ($http) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                stepCanBack: '@',
                stepStyle: '@',
                stepName: '=',
                currentStep: '=',
                currentFn: '='
            },
            template: function template(ele, attr) {
                return attr.stepStyle == 'mini' ? step2 : step1;
            },
            link: function link($scope, element, attr) {},
            controller: ['$scope', function ($scope) {
                $scope.stepName = $scope.stepName || [];
                $scope.currentStep = Number($scope.currentStep) || 0;
                // $scope.s1 = $scope.stepStyle != 'mini';
                if ($scope.currentStep < 0) {
                    $scope.currentStep = 0;
                } else if ($scope.currentStep >= $scope.stepName.length) {
                    $scope.currentStep = $scope.stepName.length;
                }

                $scope.curr = function (index) {
                    if (!$scope.stepCanBack || index > $scope.currentStep) {
                        return;
                    }
                    if (index < 0) {
                        index = 0;
                    }
                    $scope.currentStep = index;
                    if (angular.isFunction($scope.currentFn)) {
                        $scope.currentFn(index);
                    }
                };
            }]
        };
    }]);
};
//# sourceMappingURL=step.js.map