#### 实例

```html
// html-template
<div class="step-content">
  <sn-step step-can-back="true" step-style="mini" step-name="name2" current-step="cStep2" current-fn="curr2"></sn-step>
</div>
<a class="btn btn-primary" ng-click="nextStep2()">下一步</a>

// controller
$scope.name2 = ['设置登录名','验证账号','注册成功'];
$scope.cStep2 = 0;
$scope.curr2 = function(currStep) {			
  console.log(currStep);	
  $scope.cStep2 = currStep;		
};
$scope.nextStep2 = () => {
  $scope.cStep2 = Math.min(2, ++$scope.cStep2);
};
```

#### 定义和用法

步骤进度(snStep)用于页面上显示某一较长任务的进度。snStep有两种展示形态：常规形态和缩略形态。通过属性进行配置

#### 可配置的属性

<table class="table table-bordered">
  <tr>
    <th width="20%">属性</th>
    <th width="20%">值</th>
    <th width="20%">适用的标签</th>
    <th width="40%">描述</th>
  </tr>
  <tr>
    <td>* step-name</td>
    <td>字符串数组</td>
    <td>sn-step</td>
    <td>
      step-name="['step1', 'step2', 'step3']" <br>
      本属性决定了step共有几个步骤，每个步骤的名字等信息，为必须配置项
    </td>
  </tr>
  <tr>
    <td>* current-step</td>
    <td>小于 step-name的数字</td>
    <td>sn-step</td>
    <td>
      定义初始化时步骤进度的进行情况：。修改绑定改值的变量，也可以立即让进度进行至对应步骤。<br>
      在current-fn函数中，需要对该绑定值进行重新赋值
    </td>
  </tr>
  <tr>
    <td>step-style</td>
    <td>mini</td>
    <td>sn-step</td>
    <td>步骤进度的形态，默认为每个step上有数字的完整展示。配置该项后，变为缩略形式</td>
  </tr>
  <tr>
    <td>step-can-back</td>
    <td>true/[false]</td>
    <td>sn-step</td>
    <td>进度可否回退。默认为false，置为true时，点击已经执行过的步骤节点，可以回退到该步骤，并触发配置的current-fn函数</td>
  </tr>
  <tr>
    <td>current-fn</td>
    <td>function</td>
    <td>sn-step</td>
    <td>
      当step-can-back配置为true时，需要配置该属性。属性值是function，接受1个参数：点击节点时，该节点的index。
    </td>
  </tr>
</table>