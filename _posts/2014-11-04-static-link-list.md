---
author: Jerry Hsia
title: 静态链表
excerpt:
layout: post
views:
  - 100
category:
  - 数据结构
tags:
  - 
post_format: [ ]
---

### 基础篇

静态链表是不具有指针的高级语言或不使用指针，借用数组的方式来实现的链表。

![](/files/2014/static-link-list.png)

优点

- 插入、删除时间复杂度O(1)

缺点

- 由于使用数组，存储空间受限或浪费
- 查找的时间复杂度O(n)

### 实战篇

StaticLinkList.h

{% highlight  c%}

//
//  StaticLinkList.h
//  DataStructure
//
//  Created by Jerry Hsia on 11/04/14.
//  Copyright (c) 2014 Jerry Hsia. All rights reserved.
//

#ifndef DataStructure_StaticLinkList_h
#define DataStructure_StaticLinkList_h
#define MAX_SIZE 7

typedef struct StaticLinkListNode {
    int data;
    int cur; // 后继元素在数组中的索引
} SNODE, StaticLinkList[MAX_SIZE];

// 初始化链表
void s_init(StaticLinkList list) {
    for (int i = 0; i < MAX_SIZE; i++) {
        list[i].cur = i + 1;// 默认元素在数组中的位置连续
        list[i].data = 0;
    }
    list[MAX_SIZE - 1].cur = 0;// 数组最后一个元素作为链表的头结点，cur保存链表第一个元素在数组中的位置，0代表链表为空
}

// 分配存储位置
int s_malloc(StaticLinkList list) {
    int cur = list[0].cur;
    if (cur) {
        list[0].cur = list[cur].cur;
    }
    list[0].data++; // 将第一个数组元素的data字段用于存放链表长度
    return cur;
}

// 释放存储位置
void s_free(StaticLinkList list, int cur) {
    list[cur].data = 0;
    list[cur].cur = list[0].cur;
    list[0].cur = cur;
    list[0].data--;
}

// 获取链表长度
int s_length(StaticLinkList list) {
    return list[0].data;// 数组第一个元素数据域存储链表长度
}

// 打印链表
void s_print(StaticLinkList list) {
    printf("--打印链表，当前链表长度：%d\n", s_length(list));
    SNODE node = list[MAX_SIZE - 1];
    while (node.cur != 0) {
        printf("%d\n", list[node.cur].data);
        node = list[node.cur];
    }
}

// 打印原始数组
void s_print_array(StaticLinkList list) {
    printf("--打印原始数组\n");
    for (int i = 0; i < MAX_SIZE; i++) {
        printf("index:%d data:%d cur:%d \n", i, list[i].data, list[i].cur);
    }
}

// 添加一个元素
int s_add(StaticLinkList list, unsigned int index, unsigned int data) {
    printf("--在 %d 位置插入 %d\n", index, data);
    if (s_length(list) == MAX_SIZE - 2 || index > s_length(list)) return ERROR;
    int i = 0;
    int position = MAX_SIZE - 1;
    SNODE node = list[position];
    while (i < index) {
        position = node.cur;
        node = list[position];
        i++;
    }
    int next_cur = s_malloc(list);
    list[next_cur].data = data;
    list[next_cur].cur  = node.cur;
    list[position].cur = next_cur;
    return SUCCESS;
}

// 删除一个元素
int s_delete(StaticLinkList list, unsigned int index) {
    printf("--删除第 %d 个元素\n", index);
    if (index > s_length(list) - 1) return ERROR;
    int i = 0;
    int position = MAX_SIZE - 1;
    SNODE node = list[position];
    while (i < index) {
        position = node.cur;
        node = list[position];
        i++;
    }
    list[position].cur = list[node.cur].cur;
    s_free(list, node.cur);
    return SUCCESS;
}

#endif

{% endhighlight %}

main.c

{% highlight  c%}

//
//  main.c
//  DataStructure
//
//  Created by Jerry Hsia on 11/04/14.
//  Copyright (c) 2014 Jerry Hsia. All rights reserved.
//

#include <stdio.h>
#include <stdlib.h>
#include "Public.h"
#include "StaticLinkList.h"

int main(int argc, const char * argv[]) {
    
    StaticLinkList list;
    
    s_init(list);
    
    s_add(list, 0, 888);
    s_add(list, 0, 777);
    s_add(list, 0, 666);
    s_add(list, 1, 555);
    
    s_print(list);
    
    s_delete(list, 3);
    s_print(list);
    
    s_add(list, s_length(list), 999);
    s_print(list);
    s_print_array(list);
    
    return 0;
}

{% endhighlight %}

测试结果
{% highlight  bash%}

--在 0 位置插入 888
--在 0 位置插入 777
--在 0 位置插入 666
--在 1 位置插入 555
--打印链表，当前链表长度：4
666
555
777
888
--删除第 3 个元素
--打印链表，当前链表长度：3
666
555
777
--在 3 位置插入 999
--打印链表，当前链表长度：4
666
555
777
999
--打印原始数组
index:0 data:4 cur:5 
index:1 data:999 cur:0 
index:2 data:777 cur:1 
index:3 data:666 cur:4 
index:4 data:555 cur:2 
index:5 data:0 cur:6 
index:6 data:0 cur:3

{% endhighlight %}
