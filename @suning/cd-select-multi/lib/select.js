'use strict';

exports.__esModule = true;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

require('./select.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Selectj = function () {
    function Selectj(_ref) {
        var _this = this;

        var dom = _ref.dom,
            _ref$data = _ref.data,
            data = _ref$data === undefined ? [] : _ref$data,
            _ref$data_sel = _ref.data_sel,
            data_sel = _ref$data_sel === undefined ? [] : _ref$data_sel,
            config = _ref.config;
        (0, _classCallCheck3.default)(this, Selectj);

        this.initDom(dom);
        this.initData(data, data_sel, config);

        this.selectj_wrap.addEventListener('click', function (e) {
            e.stopImmediatePropagation();
            if (e.target.matches('.value-wrap,.selected-value')) {
                _this.closeAllOtherDropdown();
                _this.debounce(_this.toggleDropdown)();
            }
            if (e.target.matches('.drop-down ul li')) {
                _this.selected = _this._data.find(function (n) {
                    return n.id + '' === e.target.dataset.id + '';
                });
                _this.closeDropdown();
            }
        }, false);
        document.addEventListener('click', function (e) {
            return _this.closeDropdown();
        }, false);
        document.addEventListener('selectj:close-all', function (e) {
            return _this.allOtherDropdownHandler(e);
        }, false);
        this.selectj_input.addEventListener('input', function (e) {
            return _this.inputEvent(e);
        }, false);
    }

    Selectj.prototype.initData = function initData(data, data_sel, config) {
        config && (this.config = config);
        data_sel && (this._data_sel = data_sel);
        if (data) {
            this._data = [];
            this.data_all = data;
            this.data = this._data_100 = data.slice(0, 100);
            this.data = this.data;
        }
    };

    Selectj.prototype.initDom = function initDom(dom) {
        this.dom = dom;
        this.dom.style.display = 'none';
        this.dom_wrap = dom.parentNode;
        var tpl_select = '<span class="selectj-wrap">\n                                <span class="value-wrap">\n                                    <span class="selected-value"><span>\n                                </span>\n                            </span>';
        var frag_select = document.createRange().createContextualFragment(tpl_select);
        this.dom_wrap.appendChild(frag_select);

        var tpl_dropdown = '<span class="selectj-options" style="display:none;">\n                                <span class="drop-down">\n                                    <span class="input-wrap">\n                                        <input type="text" spellcheck="false">\n                                    </span>\n                                    <ul></ul>\n                                </span>\n                            </span>';
        var frag_dropdown = document.createRange().createContextualFragment(tpl_dropdown);
        this.selectj_wrap = this.dom_wrap.querySelector('.selectj-wrap');
        this.selectj_wrap.appendChild(frag_dropdown);

        this.selectj_value = this.selectj_wrap.querySelector('.selected-value');
        this.selectj_options = this.selectj_wrap.querySelector('.selectj-options');
        this.selectj_input = this.selectj_wrap.querySelector('.input-wrap input');
    };

    Selectj.prototype.selectData = function selectData(arr) {
        var _this2 = this;

        arr.length && arr.forEach(function (e) {
            Array.prototype.forEach.call(_this2.selectj_lis, function (n) {
                if (n.dataset.id === '' + e.id) {
                    n.classList.add('selected');
                }
            });
        });
    };

    Selectj.prototype.update = function update(_ref2) {
        var data = _ref2.data,
            data_sel = _ref2.data_sel,
            config = _ref2.config;

        this.initData(data, data_sel, config);
    };

    Selectj.prototype.closeAllOtherDropdown = function closeAllOtherDropdown() {
        var event = new CustomEvent('selectj:close-all', {
            bubbles: true,
            detail: this.dom
        });
        this.dom.dispatchEvent(event);
    };

    Selectj.prototype.allOtherDropdownHandler = function allOtherDropdownHandler(e) {
        if (e.detail !== this.dom) {
            this.closeDropdown();
        }
    };

    Selectj.prototype.toggleDropdown = function toggleDropdown() {
        if (this.selectj_options.style.display) {
            this.selectj_options.style.display = '';
        } else {
            this.selectj_options.style.display = 'none';
        }
    };

    Selectj.prototype.inputEvent = function inputEvent(e) {
        var _this3 = this;

        var arr = [],
            arr_all = this.data_all;
        for (var i = 0; i < this.data_all.length; i++) {
            if (arr_all[i].text.match(e.target.value)) {
                arr.push(arr_all[i]);
                if (arr.length >= 100) {
                    break;
                }
            }
        }

        //输入8位工号后的回调
        if (arr.length === 0 && e.target.value.length >= 8) {
            this.config.selEight({
                num: e.target.value
            }).then(function (d) {
                _this3.data = d;
            }).finally(function (d) {
                _this3.data_isSearch = false;
            });
            this.data_isSearch = true;
        }

        if (e.target.value.length >= 8) {
            this.data = [arr[0]]; //8位时去重
        } else {
            this.data = arr;
        }
    };

    Selectj.prototype.closeInputEvent = function closeInputEvent() {
        this.data = this._data_100;
    };

    Selectj.prototype.closeDropdown = function closeDropdown() {
        this.selectj_input.value = '';
        this.closeInputEvent();
        this.selectj_options.style.display = 'none';
    };

    Selectj.prototype.debounce = function debounce(fn) {
        var forbidden = false,
            self = this;

        return function () {
            if (forbidden) return;

            forbidden = true;
            setTimeout(function () {
                return forbidden = false;
            }, 300);
            fn.apply(self, arguments);
        };
    };

    (0, _createClass3.default)(Selectj, [{
        key: 'data',
        get: function get() {
            var _this4 = this;

            if (this._data.length === 0) {
                this.dom.options && Array.prototype.forEach.call(this.dom.options, function (el) {
                    var r = {
                        id: el.getAttribute('value'),
                        text: el.text
                    };
                    _this4._data.push(r);
                    _this4._data_sel.push(r);
                });
            }
            return this._data;
        },
        set: function set(v) {
            if (!v) return;
            this._data = v;
            this.selectj_ul.innerHTML = this._data.reduce(function (x, y) {
                return x + '<li data-id="' + y.id + '">' + y.text + '</li>';
            }, '');
            if (this.selectj_ul.innerHTML === '') {
                if (this.data_isSearch) {
                    this.selectj_ul.innerHTML = '<li class="no-result">\u67E5\u627E\u4E2D...</li>';
                } else {
                    this.selectj_ul.innerHTML = '<li class="no-result">\u6CA1\u6709\u5339\u914D\u7684\u7ED3\u679C</li>';
                }
            }
            this.selected_all = this.selected_all;
        }
    }, {
        key: 'selectj_ul',
        get: function get() {
            return this.selectj_options.querySelector('ul');
        }
    }, {
        key: 'selectj_lis',
        get: function get() {
            return this.selectj_ul.querySelectorAll('li');
        }
    }, {
        key: 'selected',
        set: function set(d) {
            var _this5 = this;

            if (!this.config.multi) {
                Array.prototype.forEach.call(this.selectj_lis, function (e) {
                    e.classList.remove('selected');
                });

                this.data.forEach(function (e) {
                    if (e.id === d.id) {
                        _this5.select = [e];
                        _this5.selectj_value.textContent = e.text;
                    }
                });
                this._data_sel.pop();
                this._data_sel.push(d);
                this.selectData([d]);
            } else {
                this.selectj_value.textContent = this.config.placeHolder;
                var r = this._data_sel.find(function (n) {
                    return n.id + '' === d.id + '';
                });
                if (!r) {
                    this._data_sel.push(d);
                }
                this.selectData([d]);
            }

            var event = new CustomEvent('selectj:selected', {
                bubbles: true,
                detail: d
            });
            this.dom.dispatchEvent(event);
        }
    }, {
        key: 'selected_all',
        get: function get() {
            return this._data_sel;
        },
        set: function set() {
            var _this6 = this;

            var arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

            if (!this.config.multi) {
                this.selectj_value.textContent = this.selectj_value.textContent.trim() ? this.selectj_value.textContent : this.config.placeHolder;
                Array.prototype.forEach.call(this.selectj_lis, function (e) {
                    e.classList.remove('selected');
                });

                if (arr.length) {
                    this.data.forEach(function (e) {
                        if (e.id === arr[0].id) {
                            _this6.select = [e];
                            _this6.selectj_value.textContent = e.text;
                        }
                    });
                    this._data_sel = arr;
                    this.selectData([arr[0]]);
                }
            } else {
                this.selectj_value.textContent = this.config.placeHolder;
                this._data_sel = arr;
                this.selectData(arr);
            }
        }
    }, {
        key: 'config',
        get: function get() {
            return this._config;
        },
        set: function set(config) {
            this._config = config ? config : {
                placeHolder: '请输入姓名或工号',
                multi: false
            };
            if (config) {
                this.config.placeHolder = config.placeHolder ? config.placeHolder : '请输入姓名或工号';
            }
        }
    }]);
    return Selectj;
}();

exports.default = Selectj;
//# sourceMappingURL=select.js.map