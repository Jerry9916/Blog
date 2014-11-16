---
author: Jerry Hsia
title: Web负载均衡 - Nginx反向代理(实战篇)
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

现在根据上一篇的介绍来进行反向代理实现Web负载均衡集群实现。

### 规划服务器

主反向代理服务器(IP：192.168.0.119 虚拟IP：192.168.0.200)

从反向代理服务器(IP：192.168.0.120 虚拟IP：192.168.0.200)

Web服务器(IP：192.168.0.121)

Web服务器(IP：192.168.0.122)

### 固化IP

分别编辑每台服务器的/etc/network/interfaces，修改为
{% highlight bash %}
auto lo
iface lo inet loopback

auto eth0
iface eth0 inet static  

address 192.168.0.N  # IP地址
gateway 192.168.0.1    # 网关
netmask 255.255.255.0  # 子网掩码
dns-nameservers 211.68.72.100 # DNS

{% endhighlight %}

### 配置Web服务器
nginx配置文件，lnmp详细配置过程参考[配置lnmp](/posts/lnmp.html)
{% highlight bash %}
server {
    listen   80;

    root /home/jerry/code/index;
    index index.html index.htm index.php;

    server_name localhost;

    location / {
        # First attempt to serve request as file, then
        # as directory, then fall back to index.html
        try_files $uri $uri/ /index.html;
        # Uncomment to enable naxsi on this location
        # include /etc/nginx/naxsi.rules
    }

    location /doc/ {
        alias /usr/share/doc/;
        autoindex on;
        allow 127.0.0.1;
        deny all;
    }

    # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
    #
    location ~ \.php$ {
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_pass unix:/var/run/php5-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
    }

    # deny access to .htaccess files, if Apache's document root
    # concurs with nginx's one
    #
    location ~ /\.ht {
        deny all;
    }
}
{% endhighlight %}

在/home/jerry/code/index下编写index.php文件
{% highlight php %}
<?php
echo '服务器IP：192.168.0.122<br>';
echo '--------------------------<br><pre>';
print_r($_SERVER);
echo '--------------------------</pre>';
{% endhighlight %}

### 配置代理服务器

nginx配置文件如下，两台代理服务器的nginx配置一样
{% highlight bash %}
# 集群服务器
upstream server_group {
    server 192.168.0.121:80;
    server 192.168.0.122:80;
}
server {
    listen 80;
    
    # 主从互备必须监听虚拟IP，两个代理服务器都需要监听同一个虚拟IP，虚拟IP通过keepalived配置，也可以手动配置
    # 如果只有一台代理服务器则监听本机IP
    server_name 192.168.0.200;

    location / {
        proxy_pass http://server_group; #这里的名字和上面的server_group
        proxy_redirect off;
        proxy_set_header Host $host; #用户主机
        proxy_set_header X-Real-IP $remote_addr; #用户 IP
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; #用户IP
    }
}
{% endhighlight %}

### 配置keepalived

keepalived安装过程略，编辑配置文件/etc/keepalived/keepalived.conf
{% highlight bash %}
!Configuration File for keepalived
global_defs {

   # 定义接收邮箱，这里没有配置真实的邮件服务器
   notification_email {
        root@localhost
   }
   
   # 定义发送邮箱(可随意,即便不存在也可以)
   notification_email_from admin@localhost

    # 定义邮件服务器
   smtp_server 127.0.0.1
   smtp_connect_timeout 30
   router_id LVS_DEVEL
}

#为keepalived定义服务检测脚本,定义关键字就是 vrrp_script
vrrp_script chk_keepalived_down {

    # 如果存在down文件,则返回1(表示keepalived服务失效),否则返回0(表示服务没有失效)
    script "[ -e /etc/keepalived/down ] && exit 1 || exit 0"

    # 检测间隔1秒
    interval 1
    # 如果失效,权重减2
    weight -2
}

#为nginx提供高可用
vrrp_script chk_nginx {
    # 检测nginx是否存在,如果存在返回0,如果不存在返回1
    script "killall -0 nginx"
    # 检测间隔时间
    interval 1
    # 如果失败,权重减2
    weight - 2
    # 失败检测次数
    fall 2
    # 成功检测次数
    rise 1
}

#定义vrrp实例VI_1(即一个虚拟路由器)
vrrp_instance VI_1 {
    # 若权重高，则定义此实例为主(主从区别)，从为BACKUP
    state MASTER

    # 定义接口(便于从哪个网卡进行宣告,从而进行优先级选举)
    interface eth0

    # 定义vrrp虚拟路由唯一标识,即确定vmac
    virtual_router_id 51

    # 初始权重(主从区别)，从需要比此数据小
    priority 100

    # 通告
    advert_int 1

    # 认证机制,防止未知设备,成为节点
    authentication {

        #认证类型:密码
        auth_type PASS

        #认证密钥随机字符串
        auth_pass 1111
    }

    # 定义vip
    virtual_ipaddress {
       192.168.0.200
    }

    # 追踪脚本
    track_script {
        chk_keepalived_down
        chk_nginx
    }
}
{% endhighlight %}

### 测试步骤

1、分别启动四个服务器的nginx和代理服务器的keepalived

2、打开浏览器输入http://192.168.0.200不断刷新，显示从主代理服务器访问两台Web服务器。

3、停掉主代理服务器(关机、关keepalived、关nginx)，显示从备用代理服务器访问两台Web服务器。

4、恢复主代理服务器，观察同2。

5、停掉一台Web服务器，显示只访问另一台Web服务器。

6、恢复停掉的Web服务器，观察同2。

附截图一张：

![](/files/2014/proxy-example.png)
