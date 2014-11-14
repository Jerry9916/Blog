---
author: Jerry Hsia
title: Nodejs学习笔记：02-模块化
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
server.js
{% highlight js %}
var http = require("http");
function start() {
    http.createServer(function(request, response) {
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.write("阿杰来到了Nodejs的世界！");
        response.end();
    }).listen(3000);
    console.log("Server has started.");
}
exports.start = start;//导出模块函数
{% endhighlight %}
index.js
{% highlight js %}
var server = require('./server');//包含服务器模块
server.start();//启动服务器
{% endhighlight %}
命令行
{% highlight bash %}
node index.js
{% endhighlight %}
