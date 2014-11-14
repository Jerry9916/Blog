---
author: Jerry Hsia
title: Web负载均衡 - Nginx反向代理实现负载均衡
excerpt:
layout: post
views:
  - 100
category:
  - 架构&设计
tags:
  - Linux
post_format: [ ]
---

反向代理服务的核心工作主要是转发HTTP请求，扮演了浏览器端和后台Web服务器中转的角色。因为它工作在HTTP层（应用层），也就是网络七层结构中的第七层，因此也被称为“七层负载均衡”。可以做反向代理的软件很多，比较常见的一种是Nginx。

![Nginx反向代理](/files/2014/load-balancing-nginx.jpg)

## 负载均衡模块(HTTP Upstream)目前支持4种调度算法

### 轮询(默认)

每个请求按时间顺序逐一分配到不同的后端服务器，如果后端某台服务器宕机，故障系统被自动剔除，使用户访问不受影响
{% highlight bash %}
upstream server_group {
   server 192.168.160.100:8080;
   server 192.168.160.101:8080;
}
{% endhighlight %}

### weight

指定轮询权值，weight值越大，分配到的访问机率越高，主要用于后端每个服务器性能不均的情况下
{% highlight bash %}
upstream server_group {
   server 192.168.160.100:8080 weight=1; #分担1/3的请求
   server 192.168.160.101:8080 weight=2; #分担2/3的请求
}
{% endhighlight %}

### ip_hash

每个请求的IP的hash结果分配，这一个IP访客固定一个后端服务器，可直接解决Session共享问题
{% highlight bash %}
upstream server_group {
   ip_hash;
   server 192.168.160.100:8080;
   server 192.168.160.101:8080;
}
{% endhighlight %}

### fair(第三方)

比上面两个更加智能的负载均衡算法。此种算法可以依据页面大小和加载时间长短智能地进行负载均衡，也就是根据后端服务器的响应时间来分配请求，响应时间短的优先分配。Nginx本身是不支持fair的，如果需要使用这种调度算法，必须下载Nginx的upstream_fair模块。
{% highlight bash %}
upstream server_group {
   fair;
   server 192.168.160.100:8080;
   server 192.168.160.101:8080;
}
{% endhighlight %}

### url_hash(第三方)

按访问url的hash结果来分配请求，使每个url定向到同一个后端服务器，可以进一步提高后端缓存服务器的效率。Nginx本身是不支持url_hash的，如果需要使用这种调度算法，必须安装Nginx 的hash软件包
{% highlight bash %}
upstream server_group {
   hash $request_uri;
   hash_method crc32;
   server 192.168.160.100:8080;
   server 192.168.160.101:8080;
}
{% endhighlight %}

## 负载均衡调度状态

在HTTP Upstream模块中，通过server指令指定后端服务器的同时还可以设定每个后端服务器在负载均衡调度中的状态
{% highlight bash %}
upstream server_group {
   server 192.168.160.100:8080 weight=1 max_fails=2 fail_timeout=30s;
   server 192.168.160.101:8080 weight=1 max_fails=2 fail_timeout=30s;
   server 192.168.160.102:8080 down;
   server 192.168.160.103:8080 backup;
}
{% endhighlight %}

### down

表示当前的server暂时不参与负载均衡

### backup

预留的备份机器,当其他所有的非backup机器出现故障或者忙的时候，才会请求backup机器，因此这台机器的压力最轻。

### weight 

权重，默认为1，weight越大，负载的权重就越大。

### max_fails

允许请求失败的次数，默认为1。当超过最大次数时，返回proxy_next_upstream 模块定义的错误。

### fail_timeout

在经历了max_fails次失败后，暂停服务的时间。max_fails可以和fail_timeout一起使用。

注意：当调度算法为ip_hash时，状态不能是weight和backup。

## Session共享解决方案

反向代理中，常见的一个问题，就是Web服务器存储的session数据，因为一般负载均衡的策略都是随机分配请求的。
同一个登录用户的请求，无法保证一定分配到相同的Web机器上，会导致无法找到session的问题。

- 使用ip_hash调度

- 配置转发规则，分析Cookie决定转发到的服务器，这样会消耗更多的CPU，也增加了代理服务器的负担。

- 配置独立的Session服务器统一存储，如：数据库、Redis、Memecached。

### 配置文件示例

{% highlight bash %}
server {
    
    # 负载均衡服务器组
    upstream server_group {
       server 192.168.160.100:8080 weight=1 max_fails=2 fail_timeout=30s;
       server 192.168.160.101:8080 weight=1 max_fails=2 fail_timeout=30s;
    }

    # 转发所有php请求，支持正则表达式匹配
    location ~ \.php$ {
        proxy_pass http://server_group; #这里的名字和上面的server_group的名字相同
        proxy_redirect off;
        proxy_set_header Host $host; #用户主机
        proxy_set_header X-Real-IP $remote_addr; #用户IP
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; #本代理服务器IP
    }
    
}
{% endhighlight %}
