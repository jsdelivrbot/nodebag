module.exports = function (app, option = {
    resultCode: [],
    config: {
        successCode: '0',
        alertMessage: true,
    }
}) {
    app.constant('errors', {
        500: '系统出了点小问题，请稍后重试！',
        401: {
            //需到controller中单独处理的错误
            resolve: true,
            msg: '（未授权） 请求要求身份验证'
        },
        404: '（未找到） 服务器找不到请求的网页'
    }).service('ErrorHandle', ['$q', 'errors', 'AlertService', 'LoginService',
        function ($q, errors, AlertService, LoginService) {
            'use strict';
            return {
                handle: function (data) {
                    var defer = $q.defer(),
                        defaultMessage = '系统出了点小问题，请稍后重试！',
                        message = data.message || defaultMessage;

                    //phoebus进入页面时，提示缺少appId
                    if (option.appIdHandler) {
                        let reject = option.appIdHandler(data)
                        if (reject) {
                            AlertService.alert({
                                title: '提示信息',
                                content: reject.message
                            });
                            defer.reject(data);
                            return defer.promise;
                        }
                    }

                    if (data.idsIntercepted) {
                        LoginService.jumpLogin(data);
                        defer.reject(data);
                        return defer.promise;
                    }

                    var resultCode = option.resultCode
                    if (resultCode && resultCode.length) {
                        for (var i = 0; i < resultCode.length; i++) {
                            if (data.resultCode === resultCode[i].code) {
                                resultCode[i].callback && resultCode[i].callback(defer, data)
                            }
                        }
                    }

                    if (data.resultCode === option.config.successCode) {
                        defer.resolve(data.data);
                    } else {
                        if (option.config.alertMessage && data.resultCode !== option.config.noMsgCode) {
                            AlertService.alert({
                                title: '提示信息',
                                content: message
                            });
                        }
                        defer.reject(data);
                    }
                    return defer.promise;
                }
            };
        }
    ]);
}