'use strict';

exports.__esModule = true;

var _set = require('babel-runtime/core-js/reflect/set');

var _set2 = _interopRequireDefault(_set);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

require('./pager.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Pager = function () {
    function Pager(_ref) {
        var _this = this;

        var dom = _ref.dom,
            _ref$total = _ref.total,
            total = _ref$total === undefined ? 0 : _ref$total,
            _ref$pageSize = _ref.pageSize,
            pageSize = _ref$pageSize === undefined ? 10 : _ref$pageSize,
            _ref$page = _ref.page,
            page = _ref$page === undefined ? 1 : _ref$page,
            fn = _ref.fn;
        (0, _classCallCheck3.default)(this, Pager);

        this.init(dom, total, pageSize, page, fn);
        var fnArr = [{
            sel: '.forward',
            fn: function fn() {
                return _this.page--;
            }
        }, {
            sel: '.backward',
            fn: function fn() {
                return _this.page++;
            }
        }, {
            sel: '.pageNum',
            fn: function fn(num) {
                return _this.page = num;
            }
        }, {
            sel: '.confirm',
            fn: function fn(num) {
                return _this.page = _this.input.value;
            }
        }];
        this.clickListener = this.debounce(function (e) {
            for (var i = 0; i < fnArr.length; i++) {
                if (e.target.matches(fnArr[i].sel) || e.target.parentNode.matches(fnArr[i].sel)) {
                    fnArr[i].fn(e.target.textContent.trim());
                    _this.fn({
                        page: _this.page,
                        pageSize: _this.pageSize,
                        total: _this.total
                    });
                    return;
                }
            }
        });
        this.dom.addEventListener('click', this.clickListener);
        this.input.addEventListener('keyup', this.debounce(function (e) {
            if (e.keyCode === 13 && /^\d+$/.test(_this.input.value)) {
                _this.page = _this.input.value;
            }
        }));
    }

    Pager.prototype.init = function init(dom, total, pageSize, page, fn) {
        this.dom = dom;
        this.fn = fn;
        this._total = total;
        this._pageSize = pageSize;
        this._page = page;

        this.tpl = this.getTpl();
        this.dom.appendChild(document.createRange().createContextualFragment(this.tpl));
        this.first = this.dom.querySelector('.first');
        this.forth = this.dom.querySelector('.forth span');
        this.input = this.dom.querySelector('input');
        this.total = this.total;
    };

    Pager.prototype.reset = function reset(obj) {
        for (var i in obj) {
            if (obj[i] === undefined) {
                delete obj[i];
            }
        }
        if (obj.page === 0) {
            obj.page = 1;
        }
        (0, _assign2.default)(this, obj);
        this.resetPageNum();
    };

    Pager.prototype.resetPageNum = function resetPageNum() {
        var pageNum = this.dom.querySelector('.pageNum');
        while (pageNum.lastChild) {
            pageNum.removeChild(pageNum.lastChild);
        }
        pageNum.appendChild(document.createRange().createContextualFragment(this.getNumButton()));
    };

    Pager.prototype.getNumButton = function getNumButton() {
        var _this2 = this;

        var model = new Proxy({}, {
            set: function set(target, key, value, receiver) {
                if (key >= 1 && key <= _this2.totalPage) {
                    (0, _set2.default)(target, key, value, receiver);
                }
                return true;
            }
        });
        model[this.page] = this.page;
        model[this.page - 1] = this.page - 1;
        model[this.page - 2] = this.page - 2;
        model[this.page + 1] = this.page + 1;
        model[this.page + 2] = this.page + 2;
        model[this.totalPage] = this.totalPage;
        model[1] = 1;

        var tpl = '';
        for (var i = 1; i <= this.totalPage; i++) {
            if (model[i]) {
                if (i === this.totalPage && this.totalPage >= 5) {
                    tpl += '<span class="ellipsis' + (this.totalPage - this.page < 4 ? ' hide' : '') + '">......</span>';
                }
                var current = model[i] === this.page ? ' current' : '';
                tpl += '<span class="pager-square' + current + '">' + model[i] + '</span>';
                if (i === 1 && this.totalPage >= 5) {
                    tpl += '<span class="ellipsis' + (this.page <= 4 ? ' hide' : '') + '">......</span>';
                }
            }
        }
        return tpl;
    };

    Pager.prototype.getTpl = function getTpl() {
        return '<span class="cd-pager">\n                    <span class="first">\u5171' + this.total + '\u6761\uFF0C\u6BCF\u9875\u663E\u793A' + this.pageSize + '\u6761</span>\n                    <span class="second">\n                        <span class="pager-square forward"><i class="fa fa-angle-left"></i></span>\n                        <span class="pageNum">\n                            ' + this.getNumButton() + '\n                        </span>\n                        <span class="pager-square backward"><i class="fa fa-angle-right"></i></span>\n                    </span class="third">\n                    <span class="forth">\u5171 <span>' + this.totalPage + '</span> \u9875\uFF0C\u5230\u7B2C<input type="text">\u9875</span>\n                    <span class="confirm">\u786E\u5B9A</span>\n                </span>';
    };

    Pager.prototype.debounce = function debounce(fn) {
        var running = false;
        return function () {
            if (running) return;
            running = true;
            setTimeout(function () {
                running = false;
            }, 300);
            fn.apply(null, arguments);
        };
    };

    (0, _createClass3.default)(Pager, [{
        key: 'totalPage',
        get: function get() {
            return Math.ceil(this.total / this.pageSize);
        }
    }, {
        key: 'page',
        get: function get() {
            return this._page;
        },
        set: function set(v) {
            if (/^[1-9][0-9]*$/.test(v)) {
                if (parseInt(v) <= this.totalPage) {
                    this._page = parseInt(v);
                    this.resetPageNum();
                }
            }
        }
    }, {
        key: 'total',
        get: function get() {
            return this._total;
        },
        set: function set(v) {
            if (v <= 0) {
                this.dom.style.display = 'none';
            } else {
                this.dom.style.display = '';
            }
            this.first.textContent = this.first.textContent.replace(/共\d+条/, '共' + v + '条');
            this._total = v;
            this.forth.textContent = this.totalPage;
        }
    }, {
        key: 'pageSize',
        get: function get() {
            return this._pageSize;
        },
        set: function set(v) {
            this.first.textContent = this.first.textContent.replace(/显示\d+条/, '显示' + v + '条');
            this._pageSize = v;
            this.forth.textContent = this.totalPage;
        }
    }]);
    return Pager;
}();

// if (typeof module === 'object' && module.exports) {
//     module.exports = Pager
// }else{
//     window.Pager = Pager
// }


exports.default = Pager;
//# sourceMappingURL=pager.js.map