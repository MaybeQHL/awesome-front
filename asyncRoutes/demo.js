// 动态路由后端返回的demo数据 提示：父路由必须在子路由的前面
const demoAsyncRoutes = [
    {
        id: 1,
        pid: 0,
        path: '/campus',
        name: 'Campus',
        hidden: false,
        alwaysShow: true,
        component: 'layout/Layout',
        redirect: '/nested/menu1/menu1-1',
        meta: '{ "title": "nested", "icon": "nested" }'
    },
    {
        id: 2,
        pid: 1,
        path: 'menu1',
        name: 'Menu1',
        component: 'nested/menu1/index',
        hidden: false,
        alwaysShow: true,
        meta: '{ "title": "menu1" }'
    },
    {
        id: 3,
        pid: 2,
        path: 'menu1-1',
        name: 'Menu1-1',
        component: 'nested/menu1/menu1-1',
        hidden: false,
        alwaysShow: true,
        meta: '{ "title": "menu1-1" }'
    },
    {
        id: 4,
        pid: 1,
        path: 'menu2',
        name: 'Menu2',
        component: 'nested/menu2/index',
        hidden: false,
        alwaysShow: true,
        meta: '{ "title": "menu2" }'
    }
]
const demoAsyncRoutes2 = [{
    path: '/nested',
    name: 'Nested',
    hidden: false,
    alwaysShow: true,
    component: 'layout/Layout',
    redirect: '/nested/menu1/menu1-1',
    meta: { title: 'nested', icon: 'nested' },
    children: [
        {
            path: 'menu1-1',
            name: 'Menu1-1',
            component: 'nested/menu1/menu1-1',
            hidden: false,
            alwaysShow: true,
            meta: { title: 'menu1-1' },
            children: [
                {
                    path: 'menu2',
                    name: 'Menu2',
                    component: 'nested/menu2/index',
                    hidden: false,
                    alwaysShow: true,
                    meta: { title: 'menu2' }
                }
            ]
        },
        {
            path: 'menu2',
            name: 'Menu2',
            component: 'nested/menu2/index',
            hidden: false,
            alwaysShow: true,
            meta: { title: 'menu2' }
        }
    ]
}
]


// 404路由
const notFoundRoutes = [
    {
        path: '*',
        component: () => import('@/views/errorPage/404'),
        hidden: true
    }
]

const loadView = (view) => {
    // 路由懒加载
    // return (resolve) => require([`@/views/${view}`], resolve)
    console.log(view)
    return () => import(`@/views${view}`)
}
/**
 * 格式化后端动态路由数据
 * 第一种方案
 * @param {结构参考demoAsyncRoutes}asyncRoutes 
 * @author maybe
 * @returns 
 */
const formatAsyncRoutes = (asyncRoutes) => {
    const menusMap = {}
    // 将数组转换为键值对
    asyncRoutes.forEach(item => {
        menusMap[item.id] = item
    })
    const result = []
    asyncRoutes.forEach(item => {
        item.hidden = item.hidden == '1'
        item.alwaysShow = item.alwaysShow == '1'
        item.component && (item.component = loadView(item.component));
        (item.meta && item.meta.length !== 0) && (item.meta = JSON.parse(item.meta))

        // 删除一些额外多余的属性
        delete item.ROW_NUMBER
        delete item.sort
        delete item.status
        delete item.updated_at
        delete item.created_at
        delete item.title
        delete item.icon

        const parent = menusMap[item.pid]
        if (parent) {
            // 下面reusult数组push进去对象实际是一次引用传递的过程，所以改变原对象可以影响到之后的数组
            (parent.children || (parent.children = [])).push(item)
        } else {
            result.push(item)
        }
    })
    return result
}

/**
 * 格式化后端动态路由数据
 * 第二种方案
 * @author maybe
 * @param {结构参考demoAsyncRoutes2} asyncRoutes 
 * @returns 
 */
const formatAsyncRoutesByTree = (asyncRoutes) => {
    const arr = asyncRoutes.map(item => {
        if (!item.children || item.children.length == 0) {
            return Object.assign(item, {
                component: loadView(item.component)
            })
        } else {
            return Object.assign(item, {
                component: loadView(item.component),
                children: formatAsyncRoutesByTree(item.children)
            })
        }
    })
    return arr
}

const initRoutes = async () => {
    // 后端异步路由表
    //#region  动态路由
    const re = await getAsyncRoutes()
    // 将生成数组树结构的菜单并拼接404路由
    const resultAsyncRoutes = formatAsyncRoutes(re.data).concat(notFoundRoutes)
    console.log(resultAsyncRoutes)
    // commit('SET_ROUTERS', resultAsyncRoutes)
    //#endregion
}