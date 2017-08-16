'use strict';

module.exports = function (app) {
    app.factory('User', ['$http', 'LoginService', function ($http, LoginService) {
        var loginUrl = LoginService.config.base + 'authStatus?callback=JSON_CALLBACK&_t=' + +new Date();

        return $http.jsonp(loginUrl);
    }]);
};
//# sourceMappingURL=userService.js.map