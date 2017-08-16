;
(function () {
    let pager = new Pager({
        dom: document.querySelector('div'),
        total: 220,
        pageSize: 10,
        currentPage: 4,
        fn:function (e) {
            e
        }
    })
})();