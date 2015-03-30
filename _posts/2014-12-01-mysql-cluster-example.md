---
author: Jerry Hsia
title: MySQL Cluster(配置篇)
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

基于MySQL Cluster的基本理论，接下来进行MySQL Cluster的实战。

## 规划

计划建立有5个节点的MySQL CLuster体系，因此需要用到5台机器，分别做如下用途：

节点|IP地址
管理节点(MGM)   |    192.168.0.118(db1)
数据节点1(NDBD1) |   192.168.0.119(db2)
数据节点2(NDBD2)  |  192.168.0.120(db3)
SQL节点1(SQL1)    |  192.168.0.121(db4)
SQL节点2(SQL2)     | 192.168.0.122(db5)

操作系统：Ubuntu 14.04 LTS

软件：[mysql-cluster-gpl-7.4.5-linux-glibc2.5-x86_64.tar.gz](http://dev.mysql.com/downloads/cluster)

## 配置管理节点

首先在合适的位置，创建一个管理节点的配置文件，步骤如下：

{% highlight bash %}
sudo mkdir /var/lib/mysql-cluster
sudo vi /var/lib/mysql-cluster/config.ini
{% endhighlight %}

config.ini的内容如下：

{% highlight bash %}
[NDB_MGMD]
NodeId=1
Datadir=/var/lib/mysql-cluster
Hostname=192.168.0.118
[NDBD DEFAULT]
NoOfReplicas=2
Datadir=/usr/local/mysql/data
[NDBD]
NodeId=2
Hostname=192.168.0.119
[NDBD]
NodeId=3
Hostname=192.168.0.120
[MYSQLD]
NodeId=4
Hostname=192.168.0.121
[MYSQLD]
NodeId=5
Hostname=192.168.0.122
{% endhighlight %}


安装管理节点，不需要mysqld二进制文件，只需要MySQL Cluster服务端程序(ndb_mgmd)和监听客户端程序(ndb_mgm)。这两个文件都在下载的MySQL-cluster文件解压后的bin文件夹中。执行如下步骤，在集群的管理节点上安装ndb_mgmd 和 ndb_mgm。

{% highlight bash %}
# 拷贝
sudo cp path/to/mysql-cluster-*/bin/ndb_mgm* /usr/local/bin

# 加执行权限
sudo chmod +x /usr/local/bin/ndb_mgm*
{% endhighlight %}

## 配置数据节点和SQL节点

在每台机器上都分别执行下列步骤：

{% highlight bash %}
# 增加mysql用户和mysql组
sudo groupadd mysql
sudo useradd –g mysql mysql

# 将下载的安装包解压到/usr/local位置
sudo tar -C /usr/local –xzvf /path/to/mysql-cluster.tar.gz
sudo mv /usr/local/mysql-cluster/ /usr/local/mysql/
cd /usr/local/mysql

# 安装数据库
sudo scripts/mysql_install_db --user=mysql --basedir=/usr/local/mysql --datadir=/usr/local/mysql

# 更改所属用户(组)
sudo chown -R mysql:mysql .
{% endhighlight %}

增加MySQL配置文件：

创建或修改/etc/my.cnf的内容如下：

{% highlight bash %}
[mysqld]
ndbcluster
ndb-connectstring=192.168.0.118
old_passwords=1
[mysql_cluster]
ndb-connectstring=192.168.0.118
{% endhighlight %}

将SQL节点的MySQL服务设为开启启动，数据节点好像是不要MySQL服务器的？

{% highlight bash %}
sudo cp support-files/mysql.server /etc/rc.d/init.d/
sudo update-rc.d mysql.server deafults 95
# 95启动次序
{% endhighlight %}

至此配置就初步完成了，更多的配置项参考官方。

## 启动整个集群

### 启动管理节点
{% highlight bash %}
sudo ndb_mgmd -f /var/lib/mysql-cluster/config.ini

# 使用ndb_mgm来监听客户端
sudo ndb_mgm
{% endhighlight %}

### 启动数据节点

首次启动，则需要添加--initial参数，以便进行NDB节点的初始化工作。在以后的启动过程中，则是不能添加该参数的，否则ndbd程序会清除在之前建立的所有用于恢复的数据文件和日志文件。

{% highlight bash %}
sudo /usr/local/mysql/bin/ndbd --initial
{% endhighlight %}

### 启动SQL节点

开启MySQL服务即可

## 集群实验

全部开启后在管理节点输入ndb_mgm再输入show，得到以下信息：

{% highlight bash %}
ndb_mgm> show
Cluster Configuration
---------------------
[ndbd(NDB)] 2 node(s)
id=2    @192.168.0.119  (mysql-5.6.23 ndb-7.4.5, Nodegroup: 0)
id=3    @192.168.0.120  (mysql-5.6.23 ndb-7.4.5, Nodegroup: 0, *)

[ndb_mgmd(MGM)] 1 node(s)
id=1    @192.168.0.100  (mysql-5.6.23 ndb-7.4.5)

[mysqld(API)]   2 node(s)
id=4    @192.168.0.121  (mysql-5.6.23 ndb-7.4.5)
id=5    @192.168.0.122  (mysql-5.6.23 ndb-7.4.5)
{% endhighlight %}

在一个SQL节点上建表插入数据，为了让表在cluster中正常复制，创建一个表必须使用ndbcluster引擎(engine=ndb Or engine=ndbcluster)

{% highlight bash %}
mysql> use test;
mysql> create table jerry_test(id int) engine=ndb;
mysql> insert into jerry_test values(1);
mysql> insert into jerry_test values(2);
{% endhighlight %}

在另一SQL节点执行，如果得到之前插入的数据，测试成功！　

{% highlight bash %}
mysql> use test;
mysql> select * from jerry_test;
{% endhighlight %}





