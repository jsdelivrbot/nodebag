'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (app) {
    var httpOpt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
        httpLoading: 'manual'
    };

    var loadNum = 0;
    app.factory('Loading', function () {
        return function (status, url) {
            var onloadingDiv = document.getElementById('onloadingDiv');
            if (!onloadingDiv) return;

            if (status) {
                if (url.match('isReposNameRepeat')) return;

                loadNum++;
                onloadingDiv.classList.remove('hidden');
            } else {
                loadNum--;
                if (loadNum <= 0) {
                    loadNum = 0;
                    onloadingDiv.classList.add('hidden');
                }
            }
        };
    });
    app.service('HttpSetting', [function () {
        var setting = {};

        function add(name, value) {
            setting[name] = value;
        }

        function match(name) {
            var names = (0, _keys2.default)(setting);
            for (var i = 0; i < names.length; i++) {
                if (name.match(names[i])) {
                    return {
                        name: names[i],
                        permHeader: setting[names[i]]
                    };
                }
            }
            return {};
        }

        function remove(name) {
            delete setting[name];
        }

        return {
            add: add,
            match: match,
            remove: remove
        };
    }]);
    app.service("HttpService", ["$http", "$q", "$document", "$location", "AlertService", "LoginService", "EventBus", "baseUrl", 'Loading', "ErrorHandle", "HttpSetting", "majorDataEntityTypeName", function ($http, $q, $document, $location, AlertService, LoginService, EventBus, baseUrl, Loading, ErrorHandle, HttpSetting, majorDataEntityTypeName) {
        var loginUrl = LoginService.config.base + 'authStatus?callback=JSON_CALLBACK&_t=' + +new Date();

        function busy(url) {
            document.body.style.cssText = "cursor: progress !important";
            Loading(true, url);
        }

        function idle() {
            document.body.style.cssText = "";
            Loading(false);
        }

        function sendRequest(url, params, method, option) {
            var data, config;
            var defer = $q.defer();

            if (httpOpt && httpOpt.httpLoading === 'manual') {
                if (option && option.displayLoading) {
                    busy(url);
                }
            } else {
                if (!option || option && !option.notDisplayLoading) {
                    busy(url);
                }
            }

            resourceCode(option);

            if (method === 'post' || method === 'put') {
                params.data && (params.data = (0, _stringify2.default)(params.data));
            }

            if (method === 'get' || method === 'delete') {
                data = params;
            } else {
                data = params.data;
                config = {
                    headers: params.headers
                };
            }

            $http.defaults.headers.common['currentUrl'] = location.href;

            //如果url匹配，设置权限设置头部

            var _HttpSetting$match = HttpSetting.match(url),
                name = _HttpSetting$match.name,
                permHeader = _HttpSetting$match.permHeader;

            if (permHeader) {
                for (var i in permHeader) {
                    $http.defaults.headers.common[i] = permHeader[i];
                }
                if (permHeader.isMajorData) {
                    HttpSetting.remove(name);
                }
            }
            if (window !== window.top) {
                $http.defaults.headers.common.majorDataEntityTypeName = majorDataEntityTypeName;
                $http.defaults.headers.common.majorDataId = window.top.sessionStorage.getItem("appId");
            }

            $http[method](url, data, config).success(function (result) {
                idle();

                ErrorHandle.handle(result).then(function (data) {
                    defer.resolve(data);
                }, function (data) {
                    defer.reject(data);
                });
            }).error(function (reason, status) {
                idle();

                ErrorHandle.handle(reason).then(function (data) {
                    defer.resolve(data);
                }, function (data) {
                    defer.reject(data);
                });
            });

            for (var _i in permHeader) {
                delete $http.defaults.headers.common[_i];
            }

            return defer.promise;
        }

        function resourceCode(option) {
            if (option && option.resourceCode) {
                $http.defaults.headers.common.resourceCode = option.resourceCode;
            } else {
                delete $http.defaults.headers.common.resourceCode;
            }
        }

        function addHeaders(method, param) {
            switch (method) {
                case 'get':
                    return {
                        params: param
                    };
                case 'post':
                    return {
                        data: param || {},
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    };
                case 'delete':
                    return {
                        data: (0, _stringify2.default)(param || {}),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    };
                case 'put':
                    return {
                        data: param || {},
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    };
            }
        }

        function restful(httpType) {
            return function (url, param, option) {
                var defer = $q.defer();

                if (option && option.unrestricted) {
                    sendRequest(baseUrl + url, {
                        params: param
                    }, httpType, option).then(function (result) {
                        defer.resolve(result);
                    }, function (data) {
                        defer.reject(data);
                    });
                } else {
                    sendRequest(baseUrl + url, addHeaders(httpType, param), httpType, option).then(function (result) {
                        defer.resolve(result);
                    }, function (data) {
                        defer.reject(data);
                    });
                }

                return defer.promise;
            };
        }

        return {
            "get": restful('get'),
            "post": restful('post'),
            "put": restful('put'),
            "delete": restful('delete')
        };
    }]);
};
//# sourceMappingURL=httpService.js.map