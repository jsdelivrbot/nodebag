import './select.css'
export default class Selectj {
    constructor({
        dom,
        data = [],
        data_sel = [],
        config
    }) {
        this.initDom(dom)
        this.initData(data, data_sel, config)

        this.selectj_wrap.addEventListener('click', e => {
            e.stopImmediatePropagation()
            if (e.target.matches('.value-wrap,.selected-value')) {
                this.closeAllOtherDropdown()
                this.debounce(this.toggleDropdown)()
            }
            if (e.target.matches('.drop-down ul li')) {
                this.selected = this._data.find(n => n.id + '' === e.target.dataset.id + '')
                this.closeDropdown()
            }
        }, false)
        document.addEventListener('click', e => this.closeDropdown(), false)
        document.addEventListener('selectj:close-all', e => this.allOtherDropdownHandler(e), false)
        this.selectj_input.addEventListener('input', e => this.inputEvent(e), false)
    }

    initData(data, data_sel, config) {
        config && (this.config = config);
        data_sel && (this._data_sel = data_sel);
        if (data) {
            this._data = []
            this.data_all = data
            this.data = this._data_100 = data.slice(0, 100)
            this.data = this.data
        }
    }

    initDom(dom) {
        this.dom = dom
        this.dom.style.display = 'none'
        this.dom_wrap = dom.parentNode
        let tpl_select = `<span class="selectj-wrap">
                                <span class="value-wrap">
                                    <span class="selected-value"><span>
                                </span>
                            </span>`
        let frag_select = document.createRange().createContextualFragment(tpl_select)
        this.dom_wrap.appendChild(frag_select)

        let tpl_dropdown = `<span class="selectj-options" style="display:none;">
                                <span class="drop-down">
                                    <span class="input-wrap">
                                        <input type="text" spellcheck="false">
                                    </span>
                                    <ul></ul>
                                </span>
                            </span>`
        let frag_dropdown = document.createRange().createContextualFragment(tpl_dropdown)
        this.selectj_wrap = this.dom_wrap.querySelector('.selectj-wrap')
        this.selectj_wrap.appendChild(frag_dropdown)

        this.selectj_value = this.selectj_wrap.querySelector('.selected-value')
        this.selectj_options = this.selectj_wrap.querySelector('.selectj-options')
        this.selectj_input = this.selectj_wrap.querySelector('.input-wrap input')
    }

    get data() {
        if (this._data.length === 0) {
            this.dom.options && Array.prototype.forEach.call(this.dom.options, (el) => {
                let r = {
                    id: el.getAttribute('value'),
                    text: el.text,
                }
                this._data.push(r)
                this._data_sel.push(r)
            })
        }
        return this._data
    }

    set data(v) {
        if (!v) return
        this._data = v
        this.selectj_ul.innerHTML = this._data.reduce((x, y) => {
            return `${x}<li data-id="${y.id}">${y.text}</li>`
        }, '')
        if (this.selectj_ul.innerHTML === '') {
            if (this.data_isSearch) {
                this.selectj_ul.innerHTML = `<li class="no-result">查找中...</li>`
            } else {
                this.selectj_ul.innerHTML = `<li class="no-result">没有匹配的结果</li>`
            }
        }
        this.selected_all = this.selected_all
    }

    get selectj_ul() {
        return this.selectj_options.querySelector('ul')
    }

    get selectj_lis() {
        return this.selectj_ul.querySelectorAll('li')
    }

    set selected(d) {
        if (!this.config.multi) {
            Array.prototype.forEach.call(this.selectj_lis, e => {
                e.classList.remove('selected')
            })

            this.data.forEach(e => {
                if (e.id === d.id) {
                    this.select = [e]
                    this.selectj_value.textContent = e.text
                }
            })
            this._data_sel.pop()
            this._data_sel.push(d)
            this.selectData([d]);
        } else {
            this.selectj_value.textContent = this.config.placeHolder
            let r = this._data_sel.find(n => n.id + '' === d.id + '')
            if (!r) {
                this._data_sel.push(d)
            }
            this.selectData([d])
        }

        let event = new CustomEvent('selectj:selected', {
            bubbles: true,
            detail: d
        })
        this.dom.dispatchEvent(event)
    }

    get selected_all() {
        return this._data_sel
    }

    set selected_all(arr = []) {
        if (!this.config.multi) {
            this.selectj_value.textContent = this.selectj_value.textContent.trim() ? this.selectj_value.textContent : this.config.placeHolder;
            Array.prototype.forEach.call(this.selectj_lis, e => {
                e.classList.remove('selected')
            })

            if (arr.length) {
                this.data.forEach(e => {
                    if (e.id === arr[0].id) {
                        this.select = [e]
                        this.selectj_value.textContent = e.text
                    }
                })
                this._data_sel = arr
                this.selectData([arr[0]])
            }
        } else {
            this.selectj_value.textContent = this.config.placeHolder
            this._data_sel = arr
            this.selectData(arr)
        }
    }

    selectData(arr) {
        arr.length && arr.forEach(e => {
            Array.prototype.forEach.call(this.selectj_lis, n => {
                if (n.dataset.id === '' + e.id) {
                    n.classList.add('selected')
                }
            })
        })
    }

    update({
        data,
        data_sel,
        config
    }) {
        this.initData(data, data_sel, config)
    }

    get config() {
        return this._config
    }

    set config(config) {
        this._config = config ? config : {
            placeHolder: '请输入姓名或工号',
            multi: false
        }
        if (config) {
            this.config.placeHolder = config.placeHolder ? config.placeHolder : '请输入姓名或工号'
        }
    }

    closeAllOtherDropdown() {
        let event = new CustomEvent('selectj:close-all', {
            bubbles: true,
            detail: this.dom
        })
        this.dom.dispatchEvent(event)
    }

    allOtherDropdownHandler(e) {
        if (e.detail !== this.dom) {
            this.closeDropdown()
        }
    }

    toggleDropdown() {
        if (this.selectj_options.style.display) {
            this.selectj_options.style.display = ''
        } else {
            this.selectj_options.style.display = 'none'
        }
    }

    inputEvent(e) {
        let arr = [],
            arr_all = this.data_all
        for (let i = 0; i < this.data_all.length; i++) {
            if (arr_all[i].text.match(e.target.value)) {
                arr.push(arr_all[i])
                if (arr.length >= 100) {
                    break;
                }
            }
        }

        //输入8位工号后的回调
        if (arr.length === 0 && e.target.value.length >= 8) {
            this.config.selEight({
                num: e.target.value
            }).then(d => {
                this.data = d
            }).finally(d => {
                this.data_isSearch = false
            })
            this.data_isSearch = true
        }

        if (e.target.value.length >= 8) {
            this.data = [arr[0]] //8位时去重
        } else {
            this.data = arr
        }
    }

    closeInputEvent() {
        this.data = this._data_100
    }

    closeDropdown() {
        this.selectj_input.value = ''
        this.closeInputEvent()
        this.selectj_options.style.display = 'none'
    }

    debounce(fn) {
        let forbidden = false,
            self = this

        return function() {
            if (forbidden)
                return

            forbidden = true
            setTimeout(() => forbidden = false, 300)
            fn.apply(self, arguments)
        }
    }
}