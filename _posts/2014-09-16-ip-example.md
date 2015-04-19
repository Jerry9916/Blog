---
author: Jerry Hsia
title: Web负载均衡 - IP负载均衡(实战篇)
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

现在根据上一篇的介绍来实现IP负载均衡集群实现。

### 规划服务器(Ubuntu 14.04)

Director Server简称DR服务器

主DR服务器(IP：192.168.0.119 虚拟IP：192.168.0.200)

从DR服务器(IP：192.168.0.120 虚拟IP：192.168.0.200)

Web服务器(IP：192.168.0.121)

Web服务器(IP：192.168.0.122)

### 固化IP

分别编辑每台服务器的/etc/network/interfaces，修改为
{% highlight bash %}
auto lo
iface lo inet loopback

auto eth0
iface eth0 inet static  

address 192.168.0.N  # IP地址，N分别为119~122
gateway 192.168.0.1    # 网关
netmask 255.255.255.0  # 子网掩码
dns-nameservers 211.68.72.100 # DNS

{% endhighlight %}

### 配置DR服务器

安装ipvsadm

{% highlight bash %}
sudo apt-get install ipvsadm
{% endhighlight %}

设置网络，编辑/etc/sysctl.conf，改为以下内容

{% highlight bash %}
net.ipv4.ip_forward=0
net.ipv4.conf.all.send_redirects=1
net.ipv4.conf.default.send_redirects=1
net.ipv4.conf.eth0.send_redirects=1
{% endhighlight %}

配置keepalived，编辑/etc/keepalived/keepalived.conf，修改为以下内容

{% highlight bash %}
global_defs {
   
   # 定义接收邮箱
   notification_email {
        root@localhost
   }
   
   # 定义发送邮箱(可随意，即便不存在也可以)
   notification_email_from admin@localhost

   # 定义邮件服务器
   smtp_server 127.0.0.1
   smtp_connect_timeout 30
   router_id LVS_DEVEL
}

# 为keepalived定义服务检测脚本，定义关键字就是 vrrp_script
vrrp_script chk_keepalived_down {

    # 如果存在down文件，则返回1(表示keepalived服务失效)，否则返回0(表示服务没有失效)
    script "[ -e /etc/keepalived/down ] && exit 1 || exit 0"

    # 检测间隔1秒
    interval 1
    
    # 如果失效，权重减2
    weight -2
}

# 为nginx提供高可用
vrrp_script chk_nginx {
    # 检测nginx是否存在，如果存在返回0，如果不存在返回1
    script "killall -0 nginx"
    
    # 检测间隔时间
    interval 1
    
    # 如果失败，权重减2
    weight - 2
    
    # 失败检测次数
    fall 2
    
    # 成功检测次数
    rise 1
}

# 定义vrrp实例VI_1(即一个虚拟路由器)
vrrp_instance VI_1 {
    
    # 若权重高，则定义此实例为主(主从区别)，从为BACKUP
    state MASTER

    # 定义接口(便于从哪个网卡进行宣告，从而进行优先级选举)
    interface eth0

    # 定义vrrp虚拟路由唯一标识，即确定vmac
    virtual_router_id 51

    # 初始权重(主从区别)，从需要比此数据小
    priority 100

    # 通告
    advert_int 1

    # 认证机制，防止未知设备，成为节点
    authentication {

        # 认证类型:密码
        auth_type PASS

        # 认证密钥随机字符串
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

# 为ipvs提供高可用，需要与vip相同(也可以根据防火墙标识来定义，virtual_server fwmark int)
virtual_server 192.168.0.200 80 {

    delay_loop 1
    # 负载均衡算法，若使用wrr，则real server中的权重不能相同
    lb_algo rr

    # 负载均衡模式
    lb_kind DR

    # vip掩码
    net_mask 255.255.255.255
    
    # 持久连接
    persistence_timeout 5
    
    # 负载均衡协议
    protocol TCP
    
    # 类似于fail_back
    #sorry_server 192.168.0.120 80
    
    # 定义第一个真实服务器
    real_server 192.168.0.121 80 {
        # 权重
        weight 1
        
        # real server的状态信息检测，定义http判定，并使用HTTP_GET方法检测(也可以使>用SSL_GET/TCP_CHECK检测，其中TCP_CHECK检测，仅仅只需要定义connect_timeout就可以了) 
        TCP_CHECK {
            
            # 超时时间
            connect_timeout 3

            # 重试次数
            nb_get_retry 3

            # 重试等待间隔时间
            delay_before_retry 3
        }
    }

    # 定义第二个真实服务器
    real_server 192.168.0.122 80 {
        weight 1
        
        TCP_CHECK {
            connect_timeout 3
            nb_get_retry 3
            delay_before_retry 3
        }
    }
}
              
{% endhighlight %}

如果不使用keepalived，则需要手动添加Real Server和配置虚拟IP，使用以下脚本，开机启动

{% highlight bash %}
#/bin/bash
VIP=192.168.0.200
RIP1=192.168.0.121
RIP2=192.168.0.122
GW=192.168.0.1

# 设置虚拟IP
sudo /sbin/ifconfig eth0:0 $VIP broadcast $VIP netmask 255.255.255.255 up
sudo /sbin/route add -host $VIP dev eth0:0

# 清除IPVS缓存
sudo ipvsadm -C

# 设置Real Server -p 为长连接时间 -g 为DR模式
sudo ipvsadm -A -t $VIP:80 -s rr -p 5
sudo ipvsadm -a -t $VIP:80 -r $RIP1:80 -g
sudo ipvsadm -a -t $VIP:80 -r $RIP2:80 -g

# 运行
sudo ipvsadm
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
        # First attempt to serve request as file， then
        # as directory， then fall back to index.html
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

    # deny access to .htaccess files， if Apache's document root
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

设置网络，编辑/etc/sysctl.conf，改为以下内容

{% highlight bash %}
net.ipv4.ip_forward=0
net.ipv4.conf.lo.arp_ignore=1
net.ipv4.conf.lo.arp_announce=2
net.ipv4.conf.all.arp_ignore=1
net.ipv4.conf.all.arp_announce=2
{% endhighlight %}

编写以下脚本保证开机时运行

{% highlight bash %}
#!/bin/bash
VIP=192.168.0.200

sudo /sbin/ifconfig lo:0 $VIP broadcast $VIP netmask 255.255.255.255 up
sudo /sbin/route add -host $VIP dev lo:0
{% endhighlight %}

### 测试步骤

1、分别启动Web服务器的nginx、网络配置和DR Server的keepalived。

2、打开浏览器输入http://192.168.0.200不断刷新(由于缓存，先关闭浏览器keepalive或使用不同电脑)，显示依次访问两台Web服务器。

3、停掉主DR理服务器(关机、关keepalived)，依然正常响应。

4、恢复停掉的DR服务器，观察同2。

5、停掉一台Web服务器，显示只访问另一台Web服务器。

6、恢复停掉的Web服务器，观察同2。

附上截图一张

![]({{site.static.files}}/ip-example.jpg)
