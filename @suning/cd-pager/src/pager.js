import './pager.css';

export default class Pager {
    constructor({
        dom,
        total = 0,
        pageSize = 10,
        page = 1,
        fn
    }) {
        this.init(dom, total, pageSize, page, fn)
        let fnArr = [{
            sel: '.forward',
            fn: () => this.page--
        }, {
            sel: '.backward',
            fn: () => this.page++
        }, {
            sel: '.pageNum',
            fn: num => this.page = num
        }, {
            sel: '.confirm',
            fn: num => this.page = this.input.value
        }]
        this.clickListener = this.debounce(e => {
            for (let i = 0; i < fnArr.length; i++) {
                if (e.target.matches(fnArr[i].sel) || e.target.parentNode.matches(fnArr[i].sel)) {
                    fnArr[i].fn(e.target.textContent.trim())
                    this.fn({
                        page: this.page,
                        pageSize: this.pageSize,
                        total: this.total
                    })
                    return
                }
            }
        })
        this.dom.addEventListener('click', this.clickListener)
        this.input.addEventListener('keyup', this.debounce(e => {
            if (e.keyCode === 13 && /^\d+$/.test(this.input.value)) {
                this.page = this.input.value
            }
        }))
    }

    init(dom, total, pageSize, page, fn) {
        this.dom = dom
        this.fn = fn
        this._total = total
        this._pageSize = pageSize
        this._page = page

        this.tpl = this.getTpl()
        this.dom.appendChild(document.createRange().createContextualFragment(this.tpl))
        this.first = this.dom.querySelector('.first')
        this.forth = this.dom.querySelector('.forth span')
        this.input = this.dom.querySelector('input')
        this.total = this.total
    }

    get totalPage() {
        return Math.ceil(this.total / this.pageSize)
    }

    get page() {
        return this._page
    }

    set page(v) {
        if (/^[1-9][0-9]*$/.test(v)) {
            if (parseInt(v) <= this.totalPage) {
                this._page = parseInt(v)
                this.resetPageNum()
            }
        }
    }

    get total() {
        return this._total
    }

    set total(v) {
        if (v <= 0) {
            this.dom.style.display = 'none'
        } else {
            this.dom.style.display = ''
        }
        this.first.textContent = this.first.textContent.replace(/共\d+条/, '共' + v + '条')
        this._total = v
        this.forth.textContent = this.totalPage
    }

    get pageSize() {
        return this._pageSize
    }

    set pageSize(v) {
        this.first.textContent = this.first.textContent.replace(/显示\d+条/, '显示' + v + '条')
        this._pageSize = v
        this.forth.textContent = this.totalPage
    }

    reset(obj) {
        for (let i in obj) {
            if (obj[i] === undefined) {
                delete obj[i]
            }
        }
        if (obj.page === 0) {
            obj.page = 1
        }
        Object.assign(this, obj)
        this.resetPageNum()
    }

    resetPageNum() {
        let pageNum = this.dom.querySelector('.pageNum')
        while (pageNum.lastChild) {
            pageNum.removeChild(pageNum.lastChild)
        }
        pageNum.appendChild(document.createRange().createContextualFragment(this.getNumButton()))
    }

    getNumButton() {
        let model = new Proxy({}, {
            set: (target, key, value, receiver) => {
                if (key >= 1 && key <= this.totalPage) {
                    Reflect.set(target, key, value, receiver);
                }
                return true
            }
        })
        model[this.page] = this.page
        model[this.page - 1] = this.page - 1
        model[this.page - 2] = this.page - 2
        model[this.page + 1] = this.page + 1
        model[this.page + 2] = this.page + 2
        model[this.totalPage] = this.totalPage
        model[1] = 1

        let tpl = ''
        for (let i = 1; i <= this.totalPage; i++) {
            if (model[i]) {
                if (i === this.totalPage && this.totalPage >= 5) {
                    tpl += `<span class="ellipsis${this.totalPage-this.page<4?' hide':''}">......</span>`
                }
                let current = model[i] === this.page ? ' current' : ''
                tpl += `<span class="pager-square${current}">${model[i]}</span>`
                if (i === 1 && this.totalPage >= 5) {
                    tpl += `<span class="ellipsis${this.page<=4?' hide':''}">......</span>`
                }
            }
        }
        return tpl
    }

    getTpl() {
        return `<span class="cd-pager">
                    <span class="first">共${this.total}条，每页显示${this.pageSize}条</span>
                    <span class="second">
                        <span class="pager-square forward"><i class="fa fa-angle-left"></i></span>
                        <span class="pageNum">
                            ${this.getNumButton()}
                        </span>
                        <span class="pager-square backward"><i class="fa fa-angle-right"></i></span>
                    </span class="third">
                    <span class="forth">共 <span>${this.totalPage}</span> 页，到第<input type="text">页</span>
                    <span class="confirm">确定</span>
                </span>`
    }

    debounce(fn) {
        let running = false
        return function () {
            if (running) return
            running = true
            setTimeout(() => {
                running = false
            }, 300)
            fn.apply(null, arguments)
        }
    }
}

// if (typeof module === 'object' && module.exports) {
//     module.exports = Pager
// }else{
//     window.Pager = Pager
// }