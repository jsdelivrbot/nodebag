'use strict';

exports.__esModule = true;
exports.mockFn = exports.cssLoad = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var toStateCache = void 0,
    fromStateCache = void 0,
    cssToBeEnableList = [];

function addResolve(obj) {
    (0, _assign2.default)(obj, {
        resolve: (0, _extends3.default)({}, obj.resolve, {
            css: ['$q', '$state', function ($q, $state) {
                var deferred = $q.defer();

                if (obj.cssUrl) {
                    var csslink = document.createElement('link');
                    csslink.setAttribute('rel', 'stylesheet');
                    csslink.setAttribute('type', 'text/css');
                    csslink.setAttribute('href', obj.cssUrl);
                    csslink.setAttribute('data-name', obj.name);
                    csslink.addEventListener('load', function (e) {
                        var styleSheet = csslink.sheet || csslink.styleSheet;
                        //如果可以在加载css文件的同时disabled，应该可以避免闪烁
                        styleSheet.disabled = true;
                        cssToBeEnableList.push(function (sheet) {
                            return function () {
                                sheet.disabled = false;
                            };
                        }(styleSheet));
                        deferred.resolve();
                    });
                    document.head.appendChild(csslink);
                } else {
                    deferred.resolve();
                }

                return deferred.promise;
            }]
        })
    });
    return obj;
}

function mockFn(obj, name) {
    var old = obj[name];
    obj[name] = function () {
        arguments[1].name = arguments[0];
        return old.call(obj, arguments[0], addResolve(arguments[1]));
    };
}

/**
 * 
 */
function removeCssList(sameName, exceptFile) {
    var exceptArr = exceptFile.split('.'),
        exceptStr = '',
        exceptName = '';

    exceptArr.forEach(function (e) {
        exceptName += exceptName ? '.' + e : e;
        exceptStr += ':not([data-name="' + exceptName + '"])';
    });
    var links = document.querySelectorAll('head>link[data-name]' + exceptStr);

    var _loop = function _loop(i) {
        var link = links[i];

        if (sameName.length === 0) {
            document.head.removeChild(link);
        } else {
            var name = '';
            var r = sameName.every(function (e) {
                name += name ? '.' + e : e;
                if (name !== link.dataset.name) {
                    return true;
                }
            });
            if (r) document.head.removeChild(link);
        }
    };

    for (var i = 0; i < links.length; i++) {
        _loop(i);
    }
}

/**
 * get the same part between toState.name and fromState.name
 */
function getSameStateName(toState, fromState) {
    var toStateName = toState.name.split('.'),
        fromStateName = fromState.name.split('.'),
        result = [];

    for (var i = 0; i < toStateName.length; i++) {
        if (toStateName[i] === fromStateName[i]) {
            result.push(toStateName[i]);
        } else break;
    }
    return result;
}

function cssLoad(app) {
    app.run(['$rootScope', 'LoginService', '$window', function ($rootScope, LoginService, $window) {
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
            toStateCache = toState;
            fromStateCache = fromState;
        });

        //be careful, the time of removing css file is important, or the screen view would be flashing
        $rootScope.$on('$viewContentLoaded', function (event, viewConfig) {
            if (!toStateCache || !fromStateCache) return;
            var sameName = getSameStateName(toStateCache, fromStateCache);
            var exceptName = toStateCache.name || '';
            removeCssList(sameName, exceptName);
            for (var i = 0; i < cssToBeEnableList.length; i++) {
                cssToBeEnableList.pop()();
            }
        });
    }]);
}

exports.cssLoad = cssLoad;
exports.mockFn = mockFn;
//# sourceMappingURL=load.js.map