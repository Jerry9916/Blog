---
author: Jerry Hsia
title: ThinkPHP连续插入数据时的BUG
excerpt:
layout: post
views:
  - 100
category:
  - PHP
tags:
  - PHP
  - ThinkPHP
post_format: [ ]
---
今天在使用Thinkphp的时候发现一个BUG，我需要往表里连续插入数据，结果发现中间某一条数据(A数据)如果验证不通过，后面正确的数据也不能插入，并且出错的信息与A数据都相同，查看源码后发现Model.class.php中autoValidation函数末有这样一代码片段
{% highlight php %}
<?php
// 批量验证的时候最后返回错误
if(!empty($this->error)) return false;
{% endhighlight %}
由于模型对象已经被处理为了单例，这里的出错信息将是A数据的出错信息，下一条数据(正确的一条数据)验证时这里并未释放A数据的出错信息，这里将直接判定为false造成逻辑错误，我理解的是这样。修改方法是在autoValidation开始时加上$this->error = null先进行释放，这样完美解决了。
