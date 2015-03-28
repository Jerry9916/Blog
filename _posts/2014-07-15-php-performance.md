---
author: Jerry Hsia
title: PHP性能优化
excerpt:
layout: post
views:
  - 100
category:
  - PHP
tags:
  - PHP
post_format: [ ]
---

## 什么情况下会遇到性能问题？

- PHP语法使用不当
- 用PHP语言做了它不擅长的事情
- PHP连接的服务不给力
- 其他不知道的问题

## PHP性能问题的解决方向（从简到易）

- PHP语言级性能优化
- PHP周边问题性能优化
- PHP语言底层优化

## ApacheBench(ab)工具的使用

在优化中使用ab进行压力测试来对比优化前后的性能指标，ab命令使用如下：

{% highlight bash %}
# 对baidu.com进行压力测试，-n代表总共请求数，-c代表每次并发数
ab -n100 -c10 http://baidu.com/ 

# 得下以下数据
...
Requests per second:    121.10 [#/sec] (mean)
Time per request:       82.576 [ms] (mean)
Time per request:       8.258 [ms] (mean, across all concurrent requests)
...
{% endhighlight %}

对于优化应尽力使Requests per second增大，Time per request数值减小。

## PHP语言级性能优化（有以下参考点）

- 尽量少写代码，多使用PHP内置的变量、常量、函数
- 减少魔术函数的使用
- 禁用错误抑制符号@
- 合理使用内存，用unset进行内存释放
- 少使用正则表达式
- 减少计算密集型业务
- 注意单双引号的使用
- 尽量减少IO操作
- 类的方法尽量使用静态方法static
- 包含文件时尽量使用绝对路径，避免了PHP去include_path里查找的开销
- 能使用switch case的不使用if else if语句
- 数据库连接当使用完毕时应关掉，不要用长连接
- 使用xhprof性能分析工具，改进瓶颈所在的代码

## PHP周边问题性能优化

- 对服务器硬件优化
- 对服务器软件优化
- 对PHP连接的服务优化（如：使用缓存、集群等）

## PHP语言底层优化

使用PHP扩展来实现所需要的功能

