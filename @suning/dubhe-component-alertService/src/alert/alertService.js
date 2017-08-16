import angular from 'angular';
import {dialogDrag} from './dialogDrag';
let alertTmpl = `
<div class="modal fade in">
  <div class="modal-dialog alert-modal">
    <div class="modal-content">
      <div class="modal-body">
        <div class="alert-content">
          <h5 class="alert-title" ng-switch="type">
            <i class="fa fa-info-circle text-light-blue" ng-switch-when="info"></i>
            <i class="fa fa-exclamation-circle text-orange" ng-switch-when="warning"></i>
            <i class="fa fa-check-circle text-green" ng-switch-when="success"></i>
            <i class="fa fa-times-circle text-red" ng-switch-when="error"></i>
            {{title}}
          </h5>
          <pre ng-bind-html="content"></pre>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" ng-click="close()">知道了</button>
      </div>
    </div>
  </div>
</div>		`;
let confirmTmpl = `
<div class="modal fade in">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" ng-click="close()"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span>
        </button>
        <h4 class="modal-title">{{title}}</h4>
      </div>
      <div class="modal-body">
        <div class="alert-content">
          <pre ng-bind-html="content" style="background: inherit;border: none;"></pre>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" ng-show="ok" ng-click="ok()">确定</button>
        <button type="button" class="btn btn-primary reverse" ng-show="cancel" ng-click="cancel()">取消</button>
      </div>
    </div>
  </div>
</div>		`;
export default app => {
    app.service("AlertService", ["$http", "$document", "$q", "$rootScope", "$compile","serveAlert",
        function ($http, $document, $q, $rootScope, $compile,serveAlert) {
       
            var zIndex = 1200;
            var dialogCounter = 0;

            // var mask = angular.element('<div class="modal-backdrop fade in"></div>');
            // mask.css("z-index", zIndex);

            var service = {
                alert: function (param) {
                    var alertstamp;
                    var alertmessage;
                    var ifPass = true;
                    if(serveAlert.getStamp().message == undefined){
                        alertstamp = Date.parse( new Date());
                        alertmessage = param.content;
                        serveAlert.setStamp(alertmessage,alertstamp)
                    }else{
                        var judgeMark = serveAlert.getStamp();
                        var stampNow = Date.parse( new Date());
                        var messageNow = param.content;
                        if((stampNow-judgeMark.stamp)<5*1000 && messageNow == judgeMark.message){
                            ifPass = false;
                        }
                    }
                    if(!ifPass){
                        return;
                    }
                    var defer = $q.defer();
                    var dialog;
                    dialogCounter++;

                    // if (dialogCounter == 1) {
                    //   $document.find("body").append(mask);
                    // }

                    var data = $rootScope.$new();
                    angular.extend(data, param);

                    data.ok = function () {
                        service.dismiss(dialog);
                        defer.resolve("ok");
                    };
                    data.close = function () {
                        service.dismiss(dialog);
                        defer.resolve("ok");
                    };
                    data.type = data.type || 'info';

                    dialog = $compile(angular.element(alertTmpl))(data);

                    $document.find("body").append(dialog);
                    dialog.css("display", "block");
                    dialog.css("z-index", zIndex + dialogCounter);

                    dialogDrag()(dialog);

                    return defer.promise;
                },
                confirm: function (param) {
                    var defer = $q.defer();

                    var dialog;
                    dialogCounter++;

                    // if (dialogCounter == 1) {
                    //   $document.find("body").append(mask);
                    // }

                    var data = $rootScope.$new();
                    angular.extend(data, param);

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

                    dialogDrag()(dialog);

                    return defer.promise;
                },
                dismiss: function (dialog) {
                    dialogCounter--;
                    dialog.remove();

                    if (dialogCounter == 0) {
                        // mask.remove();
                    }
                }
            };

            return service;
        }]);
}