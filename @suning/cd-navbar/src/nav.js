import menu from './menu'
export default function (app) {
    menu(app)
    app.directive('cdNavbar', [function () {
        return {
            restrict: 'E',
            template: `
                    <sn-menu class="vertical" main-menu="main-menu">
                        <sn-menu-item ng-repeat="menu in menus track by $index" ui-state="{{menu.state}}" ui-state-param="menu.param" relations="menu1.relation" class="open">
                            <t><i class="{{menu.icon}}"></i>{{menu.name}}</t>
                            <sn-menu-item2 ng-repeat="menu2 in menu.children" ui-state="{{menu2.state}}" ui-state-param="menu2.param" relations="menu2.relation">
                        <t>{{menu2.name}}</t>
                            </sn-menu-item2>
                        </sn-menu-item>
                    </sn-menu>
            `,
            scope: {
                menus: '='
            },
            link: function link($scope, element, attrs) {
                function setLeftHeight() {
                    let height = parseInt(window.getComputedStyle(element[0].parentNode).height)
                    element[0].style.height = height - 70 + 'px'
                }
                setLeftHeight()
                window.addEventListener('resize', setLeftHeight, false)
            }
        };
    }]);
}