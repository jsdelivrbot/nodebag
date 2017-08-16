
module.exports = function (app) {
    app.directive('snDot', [function () {
    	return {
    		restrict: 'AE',
    		template: '<span>{{colortext}}</span><div style=" width: 7px;height: 7px;-webkit-border-radius: 50%;display: inline-block; margin-left: 10px;" ng-style="setColor(colortext)"></div>',
    		scope: {
    			colortext: '=',
    		},
    		link: function(scope, elem, attrs) {
				//scope.colortext = attrs.colortext
               scope.setColor = function (type) {
					var color = '';
					switch(type)
						{
						case '成功':
						color = '#7ED321';
						break;
						case '失败':
						color = '#D05201';
						break;
						case '待发布':
						color = '#F5A623';
						break;
						case '发布中':
						color = '#4A90E2';
						break;
						case '启动':
						color = '#7ED321';
						break;
						case '停止':
						color = '#D05201';
						break;
						case '连接正常':
						color = '#7ED321';
						break;
						case '已停止':
						color = '#D05201';
						break;
						case '连接失败':
						color = '#A6A6A6';
						break;
						case '重启中':
						color = '#4990E2';
						break;
						case '停止中':
						color = '#F6A623';
						break;
						case '进行中':
						color = '#F6A623';
						break;
						default:
						color = '#F6A623';
					}
					return {
						'background-color': color
					};
				};

    		}
    	}
    }]);
}

