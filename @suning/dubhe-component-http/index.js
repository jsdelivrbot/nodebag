let httpService = require('./lib/httpService.js')
let loginService = require('./lib/loginService.js')
let errorHandle = require('./lib/errorHandle.js')
let userService = require('./lib/userService.js')

let main = function main(app, option) {
    option = option || {}
    app.config(function($httpProvider) {
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    });
    errorHandle(app, option.errorHandle)
    loginService(app, option.loginService)
    httpService(app, option.httpService)
    userService(app)
    app.run(['User', function(User) {
        User.then(function(d) {
            console.log(d)
        }, function(d) {
            console.log(d)
        }).catch(function(e) {
            console.log(e)
        })
    }])
}
main.loginService = loginService.fn

module.exports = main