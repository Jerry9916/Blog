---
author: Jerry Hsia
title: Objective-c学习笔记：06-协议
excerpt:
layout: post
views:
  - 100
category:
  - Objective-c
tags:
  - Objective-c
post_format: [ ]
---
定义一个协议：
{% highlight objective-c %}
//
//  Print.h
//  Lesson_06_Protocol
//
//  Created by Jerry on 14-1-1.
//  Copyright (c) 2014年 Jerry<xiajie9916@gmail.com> Blog:www.xiajie.me. All rights reserved.
//

#import <Foundation/Foundation.h>

//定义一个协议
@protocol Print <NSObject>
@required//实现该协议的类必须要实现的方法，默认为required
- (void) print;
- (void) info;
@optional
- (void) log;
@end
{% endhighlight %}
采用协议：
{% highlight objective-c %}
//
//  User.h
//  Lesson_06_Protocol
//
//  Created by Jerry on 14-1-1.
//  Copyright (c) 2014年 Jerry<xiajie9916@gmail.com> Blog:www.xiajie.me. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "Print.h"

@interface User : NSObject <Print>//可以实现更多的协议<Print1,Print2>

@end
{% endhighlight %}
实现协议方法：
{% highlight objective-c %}
//
//  User.m
//  Lesson_06_Protocol
//
//  Created by Jerry on 14-1-1.
//  Copyright (c) 2014年 Jerry<xiajie9916@gmail.com> Blog:www.xiajie.me. All rights reserved.
//

#import "User.h"

@implementation User
//协议方法的实现实在类的m文件中进行
- (void) print {
    NSLog(@"printing");
}
- (void) info {
    NSLog(@"info");
    [self test];
}
//test是一个私有方法
- (void) test {
    NSLog(@"test");
}
@end
{% endhighlight %}
测试：
{% highlight objective-c %}
//
//  main.m
//  Lesson_06_Protocol
//
//  Created by Jerry on 14-1-1.
//  Copyright (c) 2014年 Jerry<xiajie9916@gmail.com> Blog:www.xiajie.me. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "User.h"

int main(int argc, const char * argv[])
{

    @autoreleasepool {
        User *user = [[User alloc] init];
        [user print];
        [user info];
    }
    return 0;
}
{% endhighlight %}
