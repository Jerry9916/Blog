---
author: Jerry Hsia
title: >
  Objective-c学习笔记：10-对象归档
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
{% highlight objective-c %}
//
//  main.m
//  Lesson_10_ObjectArchive
//
//  Created by Jerry on 14-1-4.
//  Copyright (c) 2014年 Jerry<xiajie9916@gmail.com> Blog:www.xiajie.me. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "User.h"

int main(int argc, const char * argv[])
{

    @autoreleasepool {
        NSString *homePath = NSHomeDirectory();
        NSString *filePath = [homePath stringByAppendingPathComponent:@"Test/test.archive"];
        //一个文件归档一个对象
//        NSArray *array1 = [NSArray arrayWithObjects:@"one", @"two", @"three", nil];

//        if ([NSKeyedArchiver archiveRootObject:array1 toFile:filePath]) {
//            NSLog(@"archive success!");
//        }
//        
//        NSArray *array2 = [NSKeyedUnarchiver unarchiveObjectWithFile:filePath];
//        NSLog(@"%@", array2);

        //一个文件归档多个对象
//        NSString *homePath = NSHomeDirectory();
//        NSString *filePath = [homePath stringByAppendingPathComponent:@"Test/test.archive"];
//        NSMutableData *data = [NSMutableData data];
//        NSKeyedArchiver *archiver = [[NSKeyedArchiver alloc] initForWritingWithMutableData:data];
//        [archiver encodeObject:@"v1" forKey:@"k1"];
//        [archiver encodeObject:[NSArray arrayWithObjects:@"v1", @"v2", @"v3", nil] forKey:@"array"];
//        [archiver finishEncoding];
//        [data writeToFile:filePath atomically:YES];
//        
//        NSData *data2 = [NSData dataWithContentsOfFile:filePath];
//        NSKeyedUnarchiver *unarchiver = [[NSKeyedUnarchiver alloc] initForReadingWithData:data2];
//        NSString *str = [unarchiver decodeObjectForKey:@"k1"];
//        NSArray *array = [unarchiver decodeObjectForKey:@"array"];
//        NSLog(@"%@", array);
        //自定义对象归档
        User *user = [[User alloc] init];
        user.name = @"阿杰";
        user.password = @"123456";
        user.age = 23;
        [NSKeyedArchiver archiveRootObject:user toFile:filePath];
        User *user2 = [NSKeyedUnarchiver unarchiveObjectWithFile:filePath];
        NSLog(@"%@", user2.name);
    }
    return 0;
}
{% endhighlight %}
