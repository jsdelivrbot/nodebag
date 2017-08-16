'use strict';

exports.__esModule = true;

require('./alert.css');

exports.default = function (app) {

    app.directive('snAlert', ['$sce', function ($sce) {
        return {
            restrict: 'EA',
            scope: {
                alert: '='
            },
            template: function template(elem, attr) {
                return '<div class="alertContainter" ng-show="!close">' + '<span class="fu fu-info-circle alert-icon" aria-hidden="true"></span>' + '<span class="alert-close-button fu fu-cross" ng-click="close=!close" ></span>' + '<div style="width:96%">' + '<div class="title">' + attr.title + '</div>' + '<div class="alertMessage">' + attr.content + '</div>' + '</div>';
            }

        };
    }]);
};
//# sourceMappingURL=alert.js.map