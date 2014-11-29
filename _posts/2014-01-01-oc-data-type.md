---
author: Jerry Hsia
title: >
  Objective-c学习笔记：02-数据类型与转换
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
数据类型与转换是比较容易理解的，Objective-c跟C、Java类似，根据以往的经验，要注意运算时类型的选取和精度的考虑，复杂的问题没有，细心点就不成问题了。
{% highlight objective-c %}
//
//  main.m
//  Lesson_01_DataType
//
//  Created by Jerry on 13-12-31.
//  Copyright (c) 2013年 Jerry. All rights reserved.
//

#import <Foundation/Foundation.h>

int main(int argc, const char * argv[])
{

    @autoreleasepool {

//        int number1 = 100;
//        float number2 = 99.99f;//float的声明以f结尾
//        double number3 = 123.7777;
//        char char1 = 'x';
//        NSString *name = @"阿杰";//指针形变量声明时变量名加*，字符串常量以@开头。
//        NSLog(@"number1 : %i", number1);//%i也可替换为%d
//        NSLog(@"number2 : %f", number2);
//        NSLog(@"number3 : %f", number3);//精确小数 %.2f将保留两位小数
//        NSLog(@"name : %@", name);//打印指针形变量用%@
//        NSLog(@"char1's ASCII : %d", char1);//用整型输出将输出ASCII码
//        NSLog(@"sizeOf number1 : %ld", sizeof(number1));//打印变量占多少字节

        //数据类型转换
        // 1、自动转换：
        //   容量小的自动转换为容量大的
        //   转换顺序：Byte、short、char-->int-->long-->float-->double
        //   Byte、short、char之间不相互转换，首先转换为int再计算
        // 2、强制转换
        //   在类型转换 如：(float)(1+10)
        // 注意：大转小可能会引起精度的丢失
        Byte number1 = 100;
        int number2 = 200;
        int number3 = 300;
        double number4 = 1.5;
        Byte number5 = 30;
        NSLog(@"result : %f", (number2 + number3) * number4);//int与double计算时int自动转换为double
        int number6 = number1 + number5;
        NSLog(@"number6 : %d", number6);
        NSLog(@"%d", (Byte)(number2 + number3));//容量大的向容量小的转换，这里超出Byte范围将造成问题
    }
    return 0;
}
{% endhighlight %}
 