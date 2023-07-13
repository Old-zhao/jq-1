window.$ = window.jQuery = function (selectorOrArray) {
    let elements
    // typeof 获取数据类型
    if (typeof selectorOrArray === 'string') {
        elements = document.querySelectorAll(selectorOrArray)
        // instanceof 用来判断左侧对象是否是右侧构造函数的实例化对象
        // 下面代码意思为selectorOrArray是否为数组，Array是构造数组的函数
    } else if (selectorOrArray instanceof Array) {
        elements = selectorOrArray
    }

    let api = {
        addClass(className) {
            for (let i = 0; i < elements.length; i++) {
                elements[i].classList.add(className)
            }
            return this  // this就是api自己，return api后还能够再次调用api内的所有函数
        },
        find(selector) {
            let array = []
            for (let i = 0; i < elements.length; i++) {
                array = array.concat(Array.from(elements[i].querySelectorAll(selector)))
            }
            // 旧api中包含了elements的数据，将旧api存入数组中传给新的api
            array.oldApi = this  // 旧api
            // return this   此时如果返回api，当api再次调用addClass时，改变的依然是elements第一次获取到的标签class值，而没改变find函数获取到的标签class值 
            // return array  返回array，相当于把数组返回，函数不能够继续调用

            // 因此，需要重新创建一个jquery构造出来的新api对象，并传入数组，此时elements就等于这个数组，
            // 并且，新的jquery对象依然有addClass属性和find属性，再次调用，函数属性使用elements时，elements就等于find返回的array。
            // 下面两行代码 === return jQuery(array)
            const newApi = jQuery(array)
            return newApi
        },
        // 遍历函数
        each(fn) {
            for (let i = 0; i < elements.length; i++) {
                fn.call(null, elements[i], i)
            }
            return this
        },
        // 获取父级元素
        parents() {
            const array = []
            this.each((node) => {
                // indexof方法，能获取参数在数组中的索引，
                // 如果数组中没有这个参数，则返回-1
                if (array.indexOf(node.parentNode) < 0) {
                    array.push(node.parentNode)
                }
            })
            // 返回数组无法操作，所以返回一个新的api操作数组，新api中array等于elements
            return jQuery(array)
        },
        // 获取子级元素
        children() {
            const array = []
            // array.push(node.children[0],node.children[1],……node.children[n])
            this.each((node) => { array.push(...node.children) })
            // 返回数组无法操作，所以返回一个新的api操作数组，新api中array等于elements
            return jQuery(array)
        },
        // 获取兄弟
        siblings() {
            const array = []
            this.each((node) => {
                // 获取上一个节点
                array.push(node.previousSibling)
                // 获取下一个节点
                array.push(node.nextElementSibling)
            })
            console.log(array)
        },
        // 打印elements元素
        print() {
            console.log(elements)
        },
        // 新的api中的oldApi属性值等于数组中的oldApi
        oldApi: selectorOrArray.oldApi,
        // 使用新api调用back，返回旧的api
        back() {
            return this.oldApi
        }
    }
    return api
},




    // jQuery('.test').addClass('red').find(".child").addClass("pink")
    // jQuery('.test').addClass('red').find(".child").addClass("pink").back().addClass('a')

    // let x = jQuery('.test').find('.child')
    // x.each((x, y) => console.log(x, y))

    // jQuery('.test').children().print()
    $('.test').siblings()