"use strict";

exports.__esModule = true;

var echarts = require("echarts");

// import 'echarts/dist/echarts.min';

exports.default = function (app) {
    app.directive("echarts", ["LazyLoader", function (LazyLoader) {
        return {
            restrict: "A",
            scope: {
                echarts: "="
            },
            link: function link(scope, element, attrs) {
                var myChart = echarts.init(element[0], 'macarons');
                window.onresize = myChart.resize;

                scope.$watch("echarts", function (value) {
                    try {
                        myChart.clear();
                        myChart.setOption(scope.echarts, true);
                    } catch (ex) {
                        console.log(ex);
                    }
                }, true);
            }
        };
    }]);
};
//# sourceMappingURL=echarts.js.map