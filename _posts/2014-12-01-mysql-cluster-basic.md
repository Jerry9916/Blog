---
author: Jerry Hsia
title: MySQL Cluster(基础篇)
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

MySQL Cluster是MySQL适合于分布式计算环境的高实用、高冗余版本。它采用了NDB Cluster 存储引擎，允许在1个 Cluster 中运行多个MySQL服务器。

## MySQL Cluster概述

MySQL Cluster是一种技术，该技术允许在无共享的系统中部署“内存中”数据库的 Cluster。通过无共享体系结构，系统能够使用廉价的硬件，而且对软硬件无特殊要求。此外，由于每个组件有自己的内存和磁盘，不存在单点故障。MySQL Cluster由一组计算机构成，每台计算机上均运行着多种进程，包括MySQL服务器，NDB Cluster 的数据节点，管理服务器，以及（可能）专门的数据访问程序。关于 Cluster 中这些组件的关系，请参见下图：

![]({{site.static.files}}mysql-cluster.jpg)

所有的这些节点构成一个完成的MySQL集群体系。数据保存在“NDB存储服务器”的存储引擎中，表（结构）则保存在“MySQL服务器”中。应用程序通过“MySQL服务器”访问这些数据表，集群管理服务器通过管理工具(ndb_mgmd)来管理“NDB存储服务器”。
通过将MySQL Cluster引入开放源码世界，MySQL为所有需要它的人员提供了具有高可用性、高性能和可缩放性的Cluster 数据管理。

## MySQL Cluster中的基本概念

“NDB” 是一种“内存中”的存储引擎，它具有可用性高和数据一致性好的特点。MySQL Cluster 能够使用多种故障切换和负载平衡选项配置NDB存储引擎，但在 Cluster 级别上的存储引擎上做这个最简单。MySQL Cluster的NDB存储引擎包含完整的数据集，仅取决于 Cluster本身内的其他数据。
目前，MySQL Cluster的 Cluster部分可独立于MySQL服务器进行配置。在MySQL Cluster中，Cluster的每个部分被视为1个节点。

### 管理(MGM)节点

这类节点的作用是管理MySQL Cluster内的其他节点，如提供配置数据、启动并停止节点、运行备份等。由于这类节点负责管理其他节点的配置，应在启动其他节点之前首先启动这类节点。MGM节点是用命令“ndb_mgmd”启动的。

### 数据节点

这类节点用于保存 Cluster的数据。数据节点的数目与副本的数目相关，是片段的倍数。例如，对于两个副本，每个副本有两个片段，那么就有4个数据节点。不过没有必要设置多个副本。数据节点是用命令“ndbd”启动的。

### SQL节点

这是用来访问 Cluster数据的节点。对于MySQL Cluster，客户端节点是使用NDB Cluster存储引擎的传统MySQL服务器。通常，SQL节点是使用命令“mysqld –ndbcluster”启动的，或将“ndbcluster”添加到“my.cnf”后使用“mysqld”启动。

管理服务器(MGM节点)负责管理 Cluster配置文件和Cluster日志。Cluster中的每个节点从管理服务器检索配置数据，并请求确定管理服务器所在位置的方式。当数据节点内出现新的事件时，节点将关于这类事件的信息传输到管理服务器，然后，将这类信息写入Cluster日志。此外，可以有任意数目的Cluster客户端进程或应用程序。它们分为两种类型：

### 标准MySQL客户端

对于MySQL Cluster，它们与标准的（非 Cluster类）MySQL没有区别。换句话讲，能够从用PHP、Perl、C、C++、Java、Python、Ruby等编写的现有MySQL应用程序访问MySQL Cluster。

### 管理客户端

这类客户端与管理服务器相连，并提供了启动和停止节点、启动和停止消息跟踪（仅调试版本）、显示节点版本和状态、启动和停止备份等的命令。
