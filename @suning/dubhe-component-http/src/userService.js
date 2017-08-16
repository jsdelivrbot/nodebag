module.exports = function (app) {
    app.factory('User', ['$http', 'LoginService', function ($http, LoginService) {
        let loginUrl = LoginService.config.base + 'authStatus?callback=JSON_CALLBACK&_t=' + (+new Date());

        return $http.jsonp(loginUrl)
    }])
}