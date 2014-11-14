---
author: Jerry Hsia
title: >
  Objective-C学习笔记：05-类目与延展
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
第一种，直接在类中写类目：

User.h
{% highlight objective-c %}
//
//  User.h
//  Lesson_05_ClassCategory
//
//  Created by Jerry on 13-12-31.
//  Copyright (c) 2013年 Jerry<xiajie9916@gmail.com> Blog:www.xiajie.me. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface User : NSObject {
    int age;
    int height;
}

@property(nonatomic) int age;
@property(nonatomic) int height;

- (void) print;

@end

//直接在类定义中写类目
@interface User (Action)

- (void) run;
- (void) play;

@end
{% endhighlight %}
User.m
{% highlight objective-c %}
//
//  User.m
//  Lesson_05_ClassCategory
//
//  Created by Jerry on 13-12-31.
//  Copyright (c) 2013年 Jerry<xiajie9916@gmail.com> Blog:www.xiajie.me. All rights reserved.
//

#import "User.h"

//定义延展
@interface User ()

- (void) privateMethod;

@end

@implementation User

@synthesize age;
@synthesize height;

- (void) print {
    NSLog(@"age : %d, height : %d", age, height);
    [self privateMethod];
}

//实现延展方法
- (void) privateMethod {
    NSLog(@"这是延展的使用，相当于other语言的私有方法");
}

@end
//在类中写的类目要在类实现中进行实现
@implementation User (Action)
- (void) run {
    NSLog(@"running");
}

- (void) play {
    NSLog(@"playing");
}
@end
{% endhighlight %}
第二种，单独写类目：

User+Study.h
{% highlight objective-c %}
//
//  User+Study.h
//  Lesson_05_ClassCategory
//
//  Created by Jerry on 13-12-31.
//  Copyright (c) 2013年 Jerry<xiajie9916@gmail.com> Blog:www.xiajie.me. All rights reserved.
//

#import "User.h"

//在单独文件中写类目
@interface User (Study)
-(void) read;
-(void) write;
@end
{% endhighlight %}
User+Study.m
{% highlight objective-c %}
//
//  User+Study.m
//  Lesson_05_ClassCategory
//
//  Created by Jerry on 13-12-31.
//  Copyright (c) 2013年 Jerry<xiajie9916@gmail.com> Blog:www.xiajie.me. All rights reserved.
//

#import "User+Study.h"

//在单独文件中实现类目方法
@implementation User (Study)
-(void) read {
    NSLog(@"reading");
}
-(void) write {
    NSLog(@"writing");
}
@end
{% endhighlight %}
测试：
{% highlight objective-c %}
//
//  main.m
//  Lesson_05_ClassCategory
//
//  Created by Jerry on 13-12-31.
//  Copyright (c) 2013年 Jerry<xiajie9916@gmail.com> Blog:www.xiajie.me. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "User.h"
#import "User+Study.h"

int main(int argc, const char * argv[])
{

    @autoreleasepool {
        User *user = [[User alloc] init];
        user.age = 23;
        user.height = 172;
        [user print];
        [user play];
        [user write];
        [user read];
    }
    return 0;
}
{% endhighlight %}
