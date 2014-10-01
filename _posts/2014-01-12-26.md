---
author: Jerry Hsia
title: >
  Nodejs学习笔记：06-图片上传实例
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
安装*node-formidable*
{% highlight bash %}
npm install formidable
{% endhighlight %}
requestHandlers.js
{% highlight js %}
var querystring = require("querystring");
var fs = require("fs");
var formidable = require("formidable");
function start(response, request) {
    var body = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" content="text/html; '+
    'charset=UTF-8" />'+
    '</head>'+
    '<body>'+
    '<form action="/upload" method="post" enctype="multipart/form-data">'+
    '<input type="file" name="upload" multiple="multiple">'+
    '<input type="submit" value="提交" />'+
    '</form>'+
    '</body>'+
    '</html>';
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
}

function upload(response, request) {
    var form = new formidable.IncomingForm();
    form.parse(request, function(error, fields, files) {
        console.log("parsing done");
        //fs.renameSync(files.upload.path, "tmp/test.png");
        var readStream = fs.createReadStream(files.upload.path)
        var writeStream = fs.createWriteStream("tmp/test.png");
        util.pump(readStream, writeStream, function() {
            fs.unlinkSync(files.upload.path);
        });
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write("received image:<br/>");
        response.write("<img src='/show' />");
        response.end();
    });
}

function show(response, request) {
    fs.readFile('tmp/test.png', 'binary', function(error, file) {
        if(error) {
            response.writeHead(500, {'Content-Type': 'text/plain'});
            response.write(error + '\n');
            response.end();
        } else {
            response.writeHead(200, {'Content-Type': 'image/png'});
            response.write(file, 'binary');
            response.end();
        }
    });
}

exports.start = start;
exports.upload = upload;
exports.show = show;
{% endhighlight %}
router.js
{% highlight js %}
function route(handle, pathname, response, request) {
    if (typeof handle[pathname] === 'function') {
        handle[pathname](response, request);
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
        route(handle, pathname, response, request);
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
handle['/show'] = requestHandlers.show;
server.start(router.route, handle);//启动服务器
{% endhighlight %}
