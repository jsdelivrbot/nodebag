;
(function () {
    s1 = new Selectj({
        dom: document.querySelector('#s1')
    })
    s2 = new Selectj({
        dom: document.querySelector('#s2')
    })
    s3 = new Selectj({
        dom: document.querySelector('#s3')
    })

    document.querySelector('#s1').addEventListener('selectj:selected', e => {
        e
    })

    setTimeout(() => {
        let b = [{
            id: 0,
            text: 'a',
            selected: true
        }, {
            id: 1,
            text: 'b',
            selected: true
        }, {
            id: 2,
            text: 'c',
            selected: true
        }, {
            id: 3,
            text: 'd',
            selected: true
        }, {
            id: 4,
            text: 'e',
            selected: true
        }, {
            id: 5,
            text: 'ff',
            selected: true
        }]
        s1.update({
            data: b,
            config: {
                multi: true
            }
        })
    }, 2000)
})();