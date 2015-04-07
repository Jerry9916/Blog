---
author: Jerry Hsia
title: MySQL中MyISAM和InnoDB对比
excerpt:
layout: post
views:
  - 100
category:
  - 数据库
tags:
  - MySQL
post_format: [ ]
---

MySQL常用到的两个引擎是MyISAM和InnoDB，现在我们来比较下：

## 1、构成

MyISAM：包含frm表结构定义，myd数据文件，myi索引文件。

InnoDb：frm表结构定义，ibd数据文件(含索引保存)。

## 2、事务

MyISAM：强调的是性能，其执行数度比InnoDB类型更快，但是不提供事务支持。

InnoDb：提供事务支持，外键等高级数据库功能。

## 3、索引

MyISAM提供全文索引(FULLTEXT)

## 4、锁

InnoDB提供行锁，表的行锁也不是绝对的，如果在执行一个SQL语句时MySQL不能确定要扫描的范围，InnoDB表同样会锁全表，例如：update table set num=1 where name like “%aaa%”。

## 5、CURD

MyISAM：如果执行大量的SELECT，MyISAM是更好的选择，保存具体行数，执行select count快。

InnoDB：

- 如果数据执行大量的INSERT或UPDATE，出于性能方面的考虑，应该使用InnoDB表。

- DELETE FROM table时，InnoDB不会重新建立表，而是一行一行的删除。

- LOAD TABLE FROM MASTER操作对InnoDB是不起作用的，解决方法是首先把InnoDB表改成MyISAM表，导入数据后再改成InnoDB表，但是对于使用的额外的InnoDB特性（例如外键）的表不适用。


主要关注点就以上这些了，其实还有其他方面的比较，参考其他资料。
