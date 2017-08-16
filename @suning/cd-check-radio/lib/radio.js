'use strict';

require('./radio.css');

module.exports = function (app, option) {
	app.directive('cdRadio', [function () {
		return {
			restrict: 'E',
			scope: {
				name: '@',
				datas: '=',
				model: '='
			},
			link: function link($scope, element, attrs) {
				var el = element[0];
				$scope.$watch('datas', function () {
					if ($scope.datas) {
						init();
					}
				}, true);

				function init() {
					while (el.lastChild) {
						el.removeChild(el.lastChild);
					}

					var tpl = '';
					$scope.datas.forEach(function (e) {
						var checked = '' + (e.value === $scope.model ? ' checked' : '');
						var tpl_frag = '<div class="ux-radio-inline">\n                            <label>\n                                <input type="radio" name="' + $scope.name + '" value="' + e.value + '"' + checked + '>\n                                <span class="ux-radio-inner">' + e.key + '</span>\n                            </label>\n                        </div>';
						tpl += tpl_frag;
					});
					el.appendChild(document.createRange().createContextualFragment(tpl));
					var inputs = el.querySelectorAll('input');
					Array.prototype.forEach.call(inputs, function (n, i) {
						n.addEventListener('change', function (e) {
							$scope.model = e.target.value;
							$scope.$apply();
						});
					});
				}
			}
		};
	}]);
	app.directive('cdCheck', [function () {
		return {
			restrict: 'E',
			scope: {
				datas: '=',
				model: '='
			},
			link: function link($scope, element, attrs) {
				var el = element[0];
				$scope.$watch('datas', function () {
					if ($scope.datas) {
						init();
					}
				}, true);

				function init() {
					while (el.lastChild) {
						el.removeChild(el.lastChild);
					}

					var checked = '' + ($scope.datas.value === $scope.model ? ' checked' : '');
					var tpl = '<div class="ux-checkbox-inline">\n                            <label>\n                                <input type="checkbox" value="' + $scope.datas.value + '"' + checked + '>\n                                <span class="ux-checkbox-inner">' + $scope.datas.key + '</span>\n                            </label>\n                        </div>';
					el.appendChild(document.createRange().createContextualFragment(tpl));
					el.querySelector('input').addEventListener('change', function (e) {
						if (e.target.checked) {
							$scope.model = $scope.datas.value;
						} else {
							$scope.model = undefined;
						}
						$scope.$apply();
					});
				}
			}
		};
	}]);
};
//# sourceMappingURL=radio.js.map