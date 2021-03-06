﻿import site = require('Site');

chitu.Page.animationTime = site.config.pageAnimationTime;

var app = new chitu.Application({
    container: () => document.getElementById('main'),
    scrollType: () => {
        if (site.env.isDegrade)
            return chitu.ScrollType.Document;

        if (site.env.isIOS)
            return chitu.ScrollType.IScroll;

        if (site.env.isAndroid)
            return chitu.ScrollType.Div;

        return chitu.ScrollType.Div;
    },
    openSwipe: (routeData: chitu.RouteData) => {
        if (site.env.isDegrade)
            return chitu.SwipeDirection.None;

        var controller = routeData.values().controller;
        var action = routeData.values().action;
        var name = controller + '.' + action;
        if (name == 'Home.Index' || name == 'Home.Class' || name == 'Shopping.ShoppingCart' ||
            name == 'Home.NewsList' || name == 'User.Index')
            return chitu.SwipeDirection.None;

        if (name == 'Home.ProductDetail')
            return chitu.SwipeDirection.Up;

        return chitu.SwipeDirection.Left;
    },
    closeSwipe: (routeData: chitu.RouteData) => {
        if (site.env.isDegrade)
            return chitu.SwipeDirection.None;

        var controller = routeData.values().controller;
        var action = routeData.values().action;
        var name = controller + '.' + action;
        if (name == 'Home.Index' || name == 'Home.Class' || name == 'Shopping.ShoppingCart' ||
            name == 'Home.NewsList' || name == 'User.Index')
            return chitu.SwipeDirection.None;

        if (name == 'Home.ProductDetail')
            return chitu.SwipeDirection.Donw;

        return chitu.SwipeDirection.Right;
    }
});


app.pageCreated.add(function (sender: chitu.Application, page: chitu.Page) {

    var route_values = page.routeData.values();
    var controller = route_values.controller;
    var action = route_values.action;

    $(page.nodes().container).addClass(controller + '-' + action);

    var is_menu_page =  // 底部菜单页面
        (controller == 'Home' && (action == 'Index' || action == 'NewsList' || action == 'Class')) ||
        (controller == 'Shopping' && action == 'ShoppingCart') ||
        (controller == 'User' && action == 'Index');

    if (!is_menu_page) {
        // 实现滑动返回
        if ((<any>$).event.special.swipe) {
            $(page.node())
                .on('swiperight', function () {
                    app.back();
                })
                .on('movestart', function (e: any) {
                    if (Math.abs(e.distX) < Math.abs(e.distY)) {
                        e.preventDefault();
                    }
                });


        }
    }
    //=======================================================================

})
//}

var viewPath = '../App/Module/{controller}/{action}.html';
var actionPath = '../App/Module/{controller}/{action}';

var guidRule = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
var actionRule = /^[a-z]+$/i;
var controllerRule = /^[a-z]+$/i;

app.routes().mapRoute({
    name: 'Normal',
    url: '{controller}_{action}',
    rules: {
        controller: controllerRule,
        action: actionRule
    },
    viewPath: viewPath,
    actionPath: actionPath
});

app.routes().mapRoute({
    name: 'Shopping_Purchase',
    url: '{controller}_{action}_{id}',
    rules: {
        controller: controllerRule,
        action: actionRule,
        id: guidRule
    }
});

//app.routes().mapRoute({
//    name: 'Error',
//    url: '{controller}_{action}_{hash}',
//    rules: {
//        controller: ['Error']
//    }
//});

app.routes().mapRoute({
    name: 'OrderList',
    url: '{controller}_{action}_{status}',
    rules: {
        controller: ['Shopping'],
        action: ['OrderList']
    }
});

app.routes().mapRoute({
    name: 'ProductList',
    url: '{controller}_{action}_{type}_{name}',
    rules: {
        controller: controllerRule,
        action: actionRule,
        type: ['category', 'brand', 'search']
    }
});

app.routes().mapRoute({
    name: 'UserIndex',
    url: '{controller}_{action}_{type}',
    rules: {
        controller: ['User'],
        action: ['Index'],
    }
});

app.routes().mapRoute({
    name: 'UserInfo',
    url: '{controller}_{action}_{code}',
    rules: {
        controller: ['User'],
        action: ['UserInfo'],
    }
});

app.routes().mapRoute({
    name: 'UserInfoItemEdit',
    url: '{controller}_{action}_{field}',
    rules: {
        controller: ['User'],
        action: ['UserInfoItemEdit'],
    }
});


app.routes().mapRoute({
    name: 'AccountSecurity',
    url: 'User_{controller}_{action}',
    rules: {
        controller: ['AccountSecurity']
    },
    viewPath: '../App/Module/User/{controller}/{action}.html',
    actionPath: '../App/Module/User/{controller}/{action}'
});

app.routes().mapRoute({
    name: 'AccountSecurity1',
    url: 'User_{controller}_{action}_{type}',
    rules: {
        controller: ['AccountSecurity']
    },
    viewPath: '../App/Module/User/{controller}/{action}.html',
    actionPath: '../App/Module/User/{controller}/{action}'
});





export = window['app'] = app;





