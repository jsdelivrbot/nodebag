import './tip.css';

module.exports = function (app, option) {
    app.directive('cdTip', [function () {
        return {
            restrict: 'A',
            scope: false,
            link: function link($scope, element, attrs) {
                let tpl = `<div class="sncd-ng-tip hidden"></div>`
                element[0].appendChild(document.createRange().createContextualFragment(tpl))
                let tip = element[0].querySelector('div.sncd-ng-tip');
                tip.addEventListener('mouseover', e => {
                    e.stopImmediatePropagation();
                })

                let show = true
                element[0].addEventListener('mouseover', e => {
                    e.stopImmediatePropagation()
                    let els = document.querySelectorAll('div.sncd-ng-tip')
                    Array.prototype.forEach.call(els, e => {
                        e.classList.add('hidden')
                    })
                    if (show) {
                        var el = element[0].querySelector('div.sncd-ng-tip');
                        el.style.top = e.clientY + 'px';
                        if(attrs.last){
                              el.style.right = 100 + 'px';
                        }else{
                            el.style.left = e.clientX + 'px';
                        }
                        el.textContent = element[0].childNodes[0].textContent;
                        el.classList.toggle('hidden');
                        show = !show;
                    } else {
                        show = !show
                    }
                }, false)
                window.addEventListener('mouseover', e => {
                    let el = document.querySelectorAll('div.sncd-ng-tip')
                    Array.prototype.forEach.call(el, e => {
                        e.classList.add('hidden')
                    })
                    show = true
                }, false)
                window.addEventListener('scroll', e => {
                    let el = document.querySelectorAll('div.sncd-ng-tip')
                    Array.prototype.forEach.call(el, e => {
                        e.classList.add('hidden')
                    })
                    show = true
                }, false)
            }
        };
    }]);
}