---
author: Jerry Hsia
title: Nodejs学习笔记：03-路由
excerpt:
layout: post
views:
  - 100
category:
  - Nodejs
tags:
  - Nodejs
post_format: [ ]
---
requestHandlers.js
{% highlight js %}
function start(response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.write('start called');
    response.end();
}

function upload(response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.write('upload called');
    response.end();
}

exports.start = start;
exports.upload = upload;
{% endhighlight %}
router.js
{% highlight js %}
function route(handle, pathname, response) {
    if (typeof handle[pathname] === 'function') {
        return handle[pathname](response);
    } else {
        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.write('没有对应的处理： ' + pathname);
        response.end();
    }
}
exports.route = route;
{% endhighlight %}
server.js
{% highlight js %}
var http = require('http');
var url = require('url');

function start(route, handle) {
    function onRequest(request, response) {
        var pathname = url.parse(request.url).pathname;
        route(handle, pathname, response)
    }
    http.createServer(onRequest).listen(3000);
    console.log('服务器已启动.');
}
exports.start = start;
{% endhighlight %}
index.js
{% highlight js %}
var server = require('./server');//包含服务器模块
var router = require('./router');
var requestHandlers = require('./requestHandlers');

var handle = {}
handle['/'] = requestHandlers.start;
handle['/start'] = requestHandlers.start;
handle['/upload'] = requestHandlers.upload;
server.start(router.route, handle);//启动服务器
{% endhighlight %}
