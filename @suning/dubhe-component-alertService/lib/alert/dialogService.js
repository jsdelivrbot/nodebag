"use strict";

exports.__esModule = true;

var _dialogDrag = require("./dialogDrag");

exports.default = function (app) {
    app.service("DialogService", ["$http", "$document", "$rootScope", "$compile", '$q', '$timeout', function ($http, $document, $rootScope, $compile, $q, $timeout) {
        var zIndex = 1036;
        var dialogCounter = 0;

        var dialogMap = {};
        return {
            modal: function modal(param, data) {
                var defer = $q.defer();
                $http.get(param.url).then(function (result) {
                    //dialogCounter += 2;
                    dialogCounter = 2;
                    dialogMap[param.key] = param;
                    dialogMap[param.key].promise = defer.promise;

                    var mask = angular.element('<div class="modal-backdrop fade in"></div>');
                    $document.find("body").append(mask).addClass('overflow-hidden');
                    mask.css("z-index", zIndex + dialogCounter);

                    dialogMap[param.key].mask = mask;

                    var dialog = angular.element(result.data);
                    var newScope = $rootScope.$new();
                    if (data) {
                        angular.extend(newScope, data);
                    }
                    var element = $compile(dialog)(newScope);
                    var clientHeight = document.documentElement.clientHeight;

                    $document.find("body").append(element);
                    element.css("display", "block");
                    element.css("z-index", zIndex + dialogCounter + 1);
                    element.find('.modal-content').css('max-height', clientHeight - 60).css('overflow-y', 'auto');

                    // 如果配置了启动动画的属性，则延迟加入动画class
                    param.anim && $timeout(function () {
                        element.addClass('anim-start');
                    }, 20);

                    (0, _dialogDrag.dialogDrag)()(element);

                    dialogMap[param.key].dialog = element;
                    defer.resolve();
                });
            },

            accept: function accept(key, result) {
                this.dismiss(key);

                if (dialogMap[key].accept) {
                    dialogMap[key].accept(result);
                }
            },

            refuse: function refuse(key, reason) {
                this.dismiss(key);

                if (dialogMap[key].refuse) {
                    dialogMap[key].refuse(reason);
                }
            },

            dismiss: function dismiss(key) {
                // 如果配置了启动动画的属性，则延迟加入动画class
                dialogMap[key].dialog.addClass('anim-end');
                if (dialogMap[key].anim) {
                    $timeout(function () {
                        dialogMap[key].mask.remove();
                        dialogMap[key].dialog.removeClass('anim-start').removeClass('anim-end').remove();
                    }, dialogMap[key].animCloseDelay || 1000);
                } else {
                    dialogMap[key].mask.remove();
                    dialogMap[key].dialog.remove();
                }
                $document.find("body").removeClass('overflow-hidden');
            },

            hide: function hide(key) {
                dialogMap[key].promise.then(function () {
                    dialogMap[key].mask.hide();
                    dialogMap[key].dialog.hide();
                });
            },

            show: function show(key) {
                dialogMap[key].mask && dialogMap[key].mask.show();
                dialogMap[key].dialog && dialogMap[key].dialog.show();
            },

            dismissAll: function dismissAll() {
                for (var key in dialogMap) {
                    this.dismiss(key);
                }
            },

            postMessage: function postMessage(key, type, message) {
                if (dialogMap[key].messageHandler) {
                    if (dialogMap[key].messageHandler[type]) {
                        dialogMap[key].messageHandler[type](message);
                    }
                }
            }
        };
    }]);

    //存值
    app.service('serveAlert', function () {
        var publicValue;
        var timestamp;
        var messagestamp;
        return {
            getValue: function getValue() {

                return publicValue;
            },
            setValue: function setValue(value) {
                publicValue = value;
            },
            setStamp: function setStamp(message, stamp) {
                messagestamp = message;
                timestamp = stamp;
            },
            getStamp: function getStamp() {
                return { "message": messagestamp, "stamp": timestamp };
            }
        };
    });
};
//# sourceMappingURL=dialogService.js.map