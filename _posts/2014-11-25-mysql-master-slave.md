---
author: Jerry Hsia
title: MySQL 主从同步实践
excerpt:
layout: post
views:
  - 100
category:
  - 架构&设计
tags:
  - MySQL
post_format: [ ]
---

## 1、规划

使用两台服务器，规划如下：

用途|IP地址
Master|192.168.0.100
Slave|192.168.0.122

## 2、修改Master MySQL配置文件my.cnf如下：

{% highlight bash %}
[mysqld]
server-id=1
log_bin=mysql-bin
log_error=mysql-bin.err
binlog_do_db=master_slave # 需要同步的数据库名，多个重复此项配置
# binlog_ignore_db 需要忽略的数据库，其余都同步
{% endhighlight %}

## 3、在Master MySQL中增加同步帐号，用于Slave同步

{% highlight bash %}
mysql > GRANT REPLICATION SLAVE,REPLICATION CLIENT ON *.* to 'jerry'@'%' identified by '123456';

# 重启MySQL服务
{% endhighlight %}

## 4、查看Master状态

{% highlight bash %}
mysql> show master status\G;
*************************** 1. row ***************************
             File: mysql-bin.000005
         Position: 3964
     Binlog_Do_DB: master_slave
 Binlog_Ignore_DB: 
Executed_Gtid_Set: 
1 row in set (0.00 sec)

ERROR: 
No query specified
{% endhighlight %}

## 5、在从库中创建对应的数据库master_slave，并执行如下语句：

{% highlight bash %}
mysql> change master to master_host='192.168.0.100',master_user='jerry',master_password='123456',master_log_file='mysql-bin.000005',master_log_pos=3964;

mysql> start slave;
{% endhighlight %}

## 6、操作主库，查看从库同步
