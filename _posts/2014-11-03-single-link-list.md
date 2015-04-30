---
author: Jerry Hsia
title: 单链表
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

单链表是线性表的一种链式存储结构，链表中的节点除了存储数据外，还存储指向下一节点的指针。

头结点：放在链表开头的一个固定节点，数据域为空或存储其他信息，指针域(头指针)指向第一个数据节点。

![]({{site.static.files}}single-link-list.jpg)

优点

- 数据存储无空间限制
- 插入删除时间复杂度O(1)

缺点

- 查询时间复杂度O(n)

### 实战篇

SingleLinkList.h

{% highlight  c%}

//
//  SingleLinkList.h
//  DataStructure
//
//  Created by Jerry Hsia on 11/03/14.
//  Copyright (c) 2014 Jerry Hsia. All rights reserved.
//

#ifndef DataStructure_SingleLinkList_h
#define DataStructure_SingleLinkList_h

typedef struct SingleLinkListNode {
    int data;
    struct SingleLinkListNode* next;
} SNODE;

typedef struct SingleLinkListNode* SLIST;

// 初始化链表
SLIST s_init() {
    SLIST list = (SLIST)malloc(sizeof(SNODE));
    list->data = 0;// 头结点数据域存储链表长度
    return list;
}

// 获取链表长度
int s_length(SLIST list) {
    return list->data;
}

// 打印单链表
void s_print(SLIST list) {
    printf("--打印链表，当前链表长度%d\n", s_length(list));
    SNODE* node = list;
    while (node->next) {
        printf("%d\n", node->next->data);
        node = node->next;
    }
}

// 添加一个元素到index位置
int s_add(SLIST list, int index, int data) {
    printf("--在%d位置插入%d\n", index, data);
    if (index > s_length(list)) {
        return ERROR;
    }
    SNODE* node = list;
    int i = 0;
    while (i < index && node->next) {
        node = node->next;
        i++;
    }
    SNODE* newNode = (SNODE*)malloc(sizeof(SNODE));
    newNode->data = data;
    newNode->next = node->next;
    node->next = newNode;
    
    list->data++;
    return SUCCESS;
}

// 获取第index个元素
int s_get(SLIST list, unsigned int index) {
    printf("--获取第%d个元素\n", index);
    if (index > s_length(list) - 1) {
        return ERROR;
    }
    SNODE* node = list;
    int i = 0;
    while (i <= index && node->next) {
        node = node->next;
        i++;
    }
    return node->data;
}

// 删除一个元素
int s_delete(SLIST list, unsigned int index) {
    printf("--删除第%d个元素\n", index);
    int length = s_length(list);
    if (index > length - 1 || length == 0) {
        return ERROR;
    }
    SNODE* node = list;
    int i = 0;
    while (i < index && node->next) {
        node = node->next;
        i++;
    }
    SNODE* deleteNode = node->next;
    if (deleteNode->next) {
        node->next = deleteNode->next;
    } else {
        node->next = NULL;
    }
    
    list->data--;
    return deleteNode->data;
}

// 清空
void s_clear(SLIST list) {
    SNODE* node = list->next;
    while (node) {
        SNODE* next = node->next;
        free(node);
        node = next;
    }
    list->data = 0;
    list->next = NULL;
}
#endif

{% endhighlight %}

main.c

{% highlight  c%}

//
//  main.c
//  DataStructure
//
//  Created by Jerry Hsia on 11/03/14.
//  Copyright (c) 2014 Jerry Hsia. All rights reserved.
//

#include <stdio.h>
#include <stdlib.h>
#include "Public.h"
#include "SingleLinkList.h"

int main(int argc, const char * argv[]) {
    
    // 头插法
    SLIST singleLinkList0 = s_init();
    for (int i = 0; i < 5; i++) {
        s_add(singleLinkList0, 0, i);
    }
    s_print(singleLinkList0);
    
    // 尾插法
    SLIST singleLinkList = s_init();
    SNODE* endNode = singleLinkList;
    for (int i = 0; i < 5; i++) {
        SNODE* node = (SNODE*)malloc(sizeof(SNODE));
        node->data = i;
        endNode->next = node;
        endNode = node;
        singleLinkList->data++;
    }
    
    s_print(singleLinkList);
    
    s_add(singleLinkList, 3, 5);
    s_print(singleLinkList);
    
    printf("%d\n", s_get(singleLinkList, 3));
    s_print(singleLinkList);
    
    s_delete(singleLinkList, 1);
    s_print(singleLinkList);
    
    s_clear(singleLinkList);
    s_print(singleLinkList);
    
    return 0;
}

{% endhighlight %}

测试结果

{% highlight  c%}

--在0位置插入0
--在0位置插入1
--在0位置插入2
--在0位置插入3
--在0位置插入4
--打印链表，链表长度：5
4
3
2
1
0
--在0位置插入0
--在1位置插入1
--在2位置插入2
--在3位置插入3
--在4位置插入4
--打印链表，链表长度：5
0
1
2
3
4
--在3位置插入5
--打印链表，链表长度：6
0
1
2
5
3
4
--获取5位置的元素
4
--打印链表，链表长度：6
0
1
2
5
3
4
--删除1位置元素
--打印链表，链表长度：5
0
2
5
3
4
--清空链表
--打印链表，链表长度：0

{% endhighlight %}
