import Select from './select'
export default function (app) {
    app.directive('cdSel', [function () {
        return {
            restrict: 'E',
            template: `<select></select>`,
            scope: {
                selData: '=',
                selSelected: '=',
                selEight: '&'
            },
            link: function link($scope, element, attrs) {
                let sel = new Select({
                    dom: element[0].querySelector('select'),
                    config: {
                        multi: false,
                        selEight: $scope.selEight,
                        placeHolder: '请选择'
                    }
                })

                element[0].addEventListener('selectj:selected', e => {
                    $scope.$apply()
                })

                $scope.$watch('selData', (newData, oldData) => {
                    newData && sel.update({
                        data: newData
                    })
                })

                $scope.$watch('selSelected', (newData, oldData) => {
                    if (sel.selected_all === newData) return
                    newData && sel.update({
                        data_sel: $scope.selSelected
                    })
                })
            }
        };
    }]);
    app.directive('cdSelMulti', [function () {
        return {
            restrict: 'E',
            template: `<div class="sel-mem">
                            <div class="sel-mem-left">
                                <div class="sel-pare">
                                    <select>
                                    </select>
                                </div>
                            </div>
                            <div class="sel-mem-right">
                                <span class="wrap" ng-repeat="d in selSelected">
                                    <span class="wrap-name">{{d.text || d.name}}</span>
                                    <i class="fa fa-times-circle" aria-hidden="true" ng-click="del(d)"></i>
                                </span>
                            </div>
                        </div>`,
            scope: {
                selData: '=',
                selSelected: '=',
                selEight: '&'
            },
            link: function link($scope, element, attrs) {
                let sel = new Select({
                    dom: element[0].querySelector('.sel-pare select'),
                    config: {
                        multi: true,
                        selEight: $scope.selEight
                    }
                })

                element[0].addEventListener('selectj:selected', e => {
                    $scope.$apply()
                })

                $scope.del = function (d) {
                    for (let i = 0; i < $scope.selSelected.length; i++) {
                        if ($scope.selSelected[i].id === d.id) {
                            let len = $scope.selSelected.length - 1
                            for (let j = i; j < len; j++) {
                                $scope.selSelected[j] = $scope.selSelected[j + 1]
                            }
                            $scope.selSelected.pop()
                        }
                    }
                }

                $scope.$watch('selData', (newData, oldData) => {
                    newData && sel.update({
                        data: newData
                    })
                })

                $scope.$watch('selSelected', (newData, oldData) => {
                    if (sel.selected_all === newData) return
                    newData && sel.update({
                        data_sel: newData
                    })
                })
            }
        };
    }]);
}