import './radio.css';

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
				let el = element[0]
				$scope.$watch('datas', () => {
					if ($scope.datas) {
						init()
					}
				}, true)

				function init() {
					while (el.lastChild) {
						el.removeChild(el.lastChild)
					}

					let tpl = ''
					$scope.datas.forEach(e => {
						let checked = `${e.value===$scope.model?' checked':''}`
						let tpl_frag = `<div class="ux-radio-inline">
                            <label>
                                <input type="radio" name="${$scope.name}" value="${e.value}"${checked}>
                                <span class="ux-radio-inner">${e.key}</span>
                            </label>
                        </div>`
						tpl += tpl_frag
					})
					el.appendChild(document.createRange().createContextualFragment(tpl))
					let inputs = el.querySelectorAll('input')
					Array.prototype.forEach.call(inputs, (n, i) => {
						n.addEventListener('change', e => {
							$scope.model = e.target.value
							$scope.$apply()
						})
					})

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
				let el = element[0]
				$scope.$watch('datas', () => {
					if ($scope.datas) {
						init()
					}
				}, true)

				function init() {
					while (el.lastChild) {
						el.removeChild(el.lastChild)
					}

					let checked = `${$scope.datas.value===$scope.model?' checked':''}`
					let tpl = `<div class="ux-checkbox-inline">
                            <label>
                                <input type="checkbox" value="${$scope.datas.value}"${checked}>
                                <span class="ux-checkbox-inner">${$scope.datas.key}</span>
                            </label>
                        </div>`
					el.appendChild(document.createRange().createContextualFragment(tpl))
					el.querySelector('input').addEventListener('change', e => {
						if(e.target.checked){
                                $scope.model = $scope.datas.value
                            }else{
                                $scope.model = undefined
                            }
						$scope.$apply()
					})

				}
			}
		};
	}]);
}