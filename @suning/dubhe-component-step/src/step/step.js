let step1 = `
<div class="stepS1">
	<ul class="clearfix">
		<li ng-repeat="name in stepName" ng-click="curr($index)">
			<div class="cir" ng-class="{act0: $index == currentStep, act1: $index < currentStep}">
				<span ng-hide="$index < currentStep" ng-bind="$index+1"></span>
				<div class="text" ng-class="{act3: $index <= currentStep}" ng-bind="name"></div>
			</div>
			<div class="lineDef" ng-if="!$last"><div ng-style="{width: $index<currentStep ? '100%' : '0'}"></div></div>			
		</li>	
	</ul>
</div>		`;
let step2 = `
<div class="stepS2">
	<ul class="clearfix">
		<li ng-class="{act:$index <= currentStep}" ng-repeat="name in stepName" ng-bind="name" ng-click="curr($index)"></li>			
	</ul>
</div>		`;

export default app => {
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
            template: function (ele, attr) {
                return attr.stepStyle == 'mini' ? step2 : step1;
            },
            link: function ($scope, element, attr) {

            },
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
                }
            }]
        }
    }]);
}