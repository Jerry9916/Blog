---
author: Jerry Hsia
title: Linux配置静态IP
excerpt:
layout: post
views:
  - 100
category:
  - 其他
tags:
  - Linux
post_format: [ ]
---
{% highlight bash %}
sudo vi /etc/network/interfaces
{% endhighlight %}
添加以下内容：

{% highlight bash %}

# The loopback network interface
auto lo
iface lo inet loopback

auto eth0
iface eth0 inet static  

address 192.168.0.188  # IP地址
gateway 192.168.0.1    # 网关
netmask 255.255.255.0  # 子网掩码
dns-nameservers 211.68.72.100 # DNS

{% endhighlight %}

生效配置

{% highlight bash %}
sudo /etc/init.d/networking restart
{% endhighlight %}
