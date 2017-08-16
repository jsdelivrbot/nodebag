'use strict';

exports.__esModule = true;

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

var _dialogDrag = require('./dialogDrag');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var alertTmpl = '\n<div class="modal fade in">\n  <div class="modal-dialog alert-modal">\n    <div class="modal-content">\n      <div class="modal-body">\n        <div class="alert-content">\n          <h5 class="alert-title" ng-switch="type">\n            <i class="fa fa-info-circle text-light-blue" ng-switch-when="info"></i>\n            <i class="fa fa-exclamation-circle text-orange" ng-switch-when="warning"></i>\n            <i class="fa fa-check-circle text-green" ng-switch-when="success"></i>\n            <i class="fa fa-times-circle text-red" ng-switch-when="error"></i>\n            {{title}}\n          </h5>\n          <pre ng-bind-html="content"></pre>\n        </div>\n      </div>\n      <div class="modal-footer">\n        <button type="button" class="btn btn-primary" ng-click="close()">\u77E5\u9053\u4E86</button>\n      </div>\n    </div>\n  </div>\n</div>\t\t';
var confirmTmpl = '\n<div class="modal fade in">\n  <div class="modal-dialog">\n    <div class="modal-content">\n      <div class="modal-header">\n        <button type="button" class="close" ng-click="close()"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span>\n        </button>\n        <h4 class="modal-title">{{title}}</h4>\n      </div>\n      <div class="modal-body">\n        <div class="alert-content">\n          <pre ng-bind-html="content" style="background: inherit;border: none;"></pre>\n        </div>\n      </div>\n      <div class="modal-footer">\n        <button type="button" class="btn btn-primary" ng-show="ok" ng-click="ok()">\u786E\u5B9A</button>\n        <button type="button" class="btn btn-primary reverse" ng-show="cancel" ng-click="cancel()">\u53D6\u6D88</button>\n      </div>\n    </div>\n  </div>\n</div>\t\t';

exports.default = function (app) {
    app.service("AlertService", ["$http", "$document", "$q", "$rootScope", "$compile", "serveAlert", function ($http, $document, $q, $rootScope, $compile, serveAlert) {

        var zIndex = 1200;
        var dialogCounter = 0;

        // var mask = angular.element('<div class="modal-backdrop fade in"></div>');
        // mask.css("z-index", zIndex);

        var service = {
            alert: function alert(param) {
                var alertstamp;
                var alertmessage;
                var ifPass = true;
                if (serveAlert.getStamp().message == undefined) {
                    alertstamp = Date.parse(new Date());
                    alertmessage = param.content;
                    serveAlert.setStamp(alertmessage, alertstamp);
                } else {
                    var judgeMark = serveAlert.getStamp();
                    var stampNow = Date.parse(new Date());
                    var messageNow = param.content;
                    if (stampNow - judgeMark.stamp < 5 * 1000 && messageNow == judgeMark.message) {
                        ifPass = false;
                    }
                }
                if (!ifPass) {
                    return;
                }
                var defer = $q.defer();
                var dialog;
                dialogCounter++;

                // if (dialogCounter == 1) {
                //   $document.find("body").append(mask);
                // }

                var data = $rootScope.$new();
                _angular2.default.extend(data, param);

                data.ok = function () {
                    service.dismiss(dialog);
                    defer.resolve("ok");
                };
                data.close = function () {
                    service.dismiss(dialog);
                    defer.resolve("ok");
                };
                data.type = data.type || 'info';

                dialog = $compile(_angular2.default.element(alertTmpl))(data);

                $document.find("body").append(dialog);
                dialog.css("display", "block");
                dialog.css("z-index", zIndex + dialogCounter);

                (0, _dialogDrag.dialogDrag)()(dialog);

                return defer.promise;
            },
            confirm: function confirm(param) {
                var defer = $q.defer();

                var dialog;
                dialogCounter++;

                // if (dialogCounter == 1) {
                //   $document.find("body").append(mask);
                // }

                var data = $rootScope.$new();
                _angular2.default.extend(data, param);

                data.ok = function () {
                    service.dismiss(dialog);
                    defer.resolve("ok");
                };
                data.cancel = function () {
                    service.dismiss(dialog);
                    defer.reject("cancel");
                };
                data.close = function () {
                    service.dismiss(dialog);
                    defer.reject("cancel");
                };

                dialog = $compile(confirmTmpl)(data);

                $document.find("body").append(dialog);
                dialog.css("display", "block");
                dialog.css("z-index", zIndex + dialogCounter);

                (0, _dialogDrag.dialogDrag)()(dialog);

                return defer.promise;
            },
            dismiss: function dismiss(dialog) {
                dialogCounter--;
                dialog.remove();

                if (dialogCounter == 0) {
                    // mask.remove();
                }
            }
        };

        return service;
    }]);
};
//# sourceMappingURL=alertService.js.map