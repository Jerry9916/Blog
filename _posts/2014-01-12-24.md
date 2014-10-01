---
author: Jerry Hsia
title: >
  Nodejs学习笔记：04-阻塞与非阻塞
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
接上一次修改requestHandlers.js
{% highlight js %}
function start(response) {
    function wait(milliSeconds) {
        var startTime = new Date().getTime();
        while (new Date().getTime() < startTime + milliSeconds);
    }
    wait(10000);//这里将造成请求的阻塞
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
这样start启动后将造成后面的所有请求阻塞，解决方法是使用回调函数。
{% highlight js %}
var exec = require("child_process").exec;

function start(response) {
    exec('find /', { timeout: 10000, maxBuffer: 20000*1024 }, function (error, stdout, stderr) {
        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.write(stdout);
        response.end();
    });
}

function upload(response) {
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("upload called");
    response.end();
}

exports.start = start;
exports.upload = upload;
{% endhighlight %}
