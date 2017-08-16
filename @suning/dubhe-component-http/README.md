cd项目dubhe框架的HttpService，支持苏宁内网passport及cupid独立passport的登入、登出及单点登陆

# Usage

```bash
$ npm install @suning/dubhe-component-http --save
```

```js
import httpService from '@suning/dubhe-component-http';

option = {
    errorHandle: {
        resultCode: [{
            code: '03001',
            callback: function () {
                http.loginService.logout({
                    beforeService: 'cupidAdminAuth=false',
                    service: location.origin + '/error.html'
                })
            }
        }],
        config: {
            successCode: '0',
            alertMessage: true,
            noMsgCode: '-1'
        },
        appIdHandler: function (d) {
            if (d && !d.resultCode) {
                if (!sessionStorage.getItem("appId")) {
                    return {
                        message: '缺少应用Id'
                    }
                }
            }
        }
    }
}
httpService(app, option);//已注入HttpService服务了
```

# Version

## 0.0.14

add loginService.logout

## 0.0.15

add loginService.config

## 0.0.24

增加静态的logout方法

## 0.0.53

修复iframe中logout返回的地址为phoebus系统

## 0.0.54

add appIdHandler for phoebus