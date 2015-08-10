---
author: Jerry Hsia
title: 编译安装PHP扩展
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
## 1、首先要安装autoconf。

下载地址：[http://ftp.gnu.org/gnu/autoconf/][1]

解压并进入autoconf目录，依次执行如下命令：
{% highlight bash %}
./configure
make
sudo make install
{% endhighlight %}

## 2、安装mcrpty扩展。

Mcrypt是一个功能强大的加密算法扩展库，它持20多种加密算法和8种加密模式。Mac OS X中，需要先安装这个库然后再安装PHP扩展。

首先是下载扩展库的源文件，下载地址：[http://sourceforge.net/projects/mcrypt/files/Libmcrypt/2.5.8/][2]

下载到本地之后，解压缩，进入目录，请依次执行如下命令：
{% highlight bash %}
./configure --disable-posix-threads --enable-static
make
sudo make install
{% endhighlight %}

安装好扩展库之后，下载PHP的源代码，（php -v 命令查看版本，我的是5.4.24）。

下载地址：[http://cn2.php.net/get/php-5.4.24.tar.bz2/from/a/mirror][3]  
完成下载之后，请解包进入代码目录，再cd ext/mcrypt/，然后依次执行如下命令：
{% highlight bash %}
phpize
./configure
make
sudo make install
{% endhighlight %}

正确完成安装之后，会显示说明
{% highlight bash %}
Installing shared extensions:     /usr/lib/php/extensions/no-debug-non-zts-20100525/
{% endhighlight %}
编辑/etc/php.ini文件，加入如下配置行：
{% highlight bash %}
extension=/usr/lib/php/extensions/no-debug-non-zts-20100525/mcrypt.so
{% endhighlight %}
 

### 注：在mac mavericks下可能有下列问题

{% highlight bash %}
grep: /usr/include/php/main/php.h: No such file or directory

grep: /usr/include/php/Zend/zend_modules.h: No such file or directory

grep: /usr/include/php/Zend/zend_extensions.h: No such file or directory

Configuring for:

PHP Api Version:

Zend Module Api No:

Zend Extension Api No:
{% endhighlight %}
### 解决方法
{% highlight bash %}
ln -s /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX10.9.sdk/usr/include /usr/include
{% endhighlight %}
[1]: http://ftp.gnu.org/gnu/autoconf/ "http://ftp.gnu.org/gnu/autoconf/"
[2]: http://sourceforge.net/projects/mcrypt/files/Libmcrypt/2.5.8/ "http://sourceforge.net/projects/mcrypt/files/Libmcrypt/2.5.8/"
[3]: http://cn2.php.net/get/php-5.4.24.tar.bz2/from/a/mirror "http://cn2.php.net/get/php-5.4.24.tar.bz2/from/a/mirror"
