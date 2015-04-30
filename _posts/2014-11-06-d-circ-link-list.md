---
author: Jerry Hsia
title: 双向循环链表
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

双向循环链表在循环链表的基础上给每个节点增加一个前驱指针域指向前一个节点，其中头结点的前驱指针指向尾节点。

![]({{site.static.files}}d-circ-link-list.jpg)

优点

- 存储空间不受限制
- 插入、删除时间复杂度O(1)
- 由于增加了前驱指针，可以灵活选择向前或向后遍历

缺点

- 查找时间复杂度仍为O(n)

### 实战篇

头文件DCircLinkList.h

{% highlight  c%}

//
//  DCircLinkList.h
//  DataStructure
//
//  Created by Jerry Hsia on 11/06/14.
//  Copyright (c) 2014 Jerry Hsia. All rights reserved.
//

#ifndef DataStructure_CircLinkList_h
#define DataStructure_CircLinkList_h

typedef struct CircLinkListNode {
    int data;
    struct CircLinkListNode* pre;// 前指针
    struct CircLinkListNode* next;// 后指针
} CNODE;

struct CircLinkList {
    CNODE* head;// 头结点指针
    CNODE* rear;// 尾节点指针
};

typedef struct CircLinkList* CLIST;

// 初始化链表
CLIST c_init() {
    CLIST circLinkList = (CLIST)malloc(sizeof(CLIST));
    CNODE* head = (CNODE*)malloc(sizeof(CNODE));
    head->data = 0;// 头结点数据域存储链表长度
    head->next = head;// 头结点指针指向头结点
    head->pre = head;
    circLinkList->rear = head;// 尾指针指向头结点
    circLinkList->head = head;
    return circLinkList;
}

// 获取链表长度
int c_length(CLIST list) {
    return list->head->data;
}

// 是否为逆向遍历，index过半后，从尾指针开始遍历
int c_reverse(CLIST list, unsigned index) {
    return index <= c_length(list)/2 ? 0 : 1;
}

// 打印链表
void c_print(CLIST list) {
    printf("--打印链表，链表长度：%d\n", c_length(list));
    CNODE* node = list->head;
    while (node->next != list->head) {
        printf("pre: %d data: %d next: %d\n", node->next->pre->data, node->next->data, node->next->next->data);
        node = node->next;
    }
}

// 添加一个元素到index位置
int c_add(CLIST list, unsigned int index, int data) {
    printf("--在%d位置插入%d\n", index, data);
    if (index > c_length(list)) {
        return ERROR;
    }
    CNODE* newNode = (CNODE*)malloc(sizeof(CNODE));
    newNode->data = data;
    int i = 0;
    int reverse = c_reverse(list, index);
    CNODE* node;// 在node后插入
    if (reverse) {// 在末尾插入，直接在尾节点后插入，时间复杂度O(1)
        index = c_length(list) - index;
        node = list->rear;
    } else {
        node = list->head;
    }
    while (i < index) {
        if (reverse) {
            node = node->pre;
        } else {
            node = node->next;
        }
        i++;
    }
    if (node == list->rear) {
        list->rear = newNode;
    }
    newNode->next = node->next;
    node->next->pre = newNode;
    node->next = newNode;
    newNode->pre = node;
    list->head->data++;
    return SUCCESS;
}

// 获取第index个元素
int c_get(CLIST list, unsigned int index) {
    printf("--获取%d位置的元素\n", index);
    if (c_length(list) == 0 || index > c_length(list) - 1) {
        return ERROR;
    }
    CNODE* node;// node为获取的元素
    int i = 0;
    int reverse = c_reverse(list, index);
    if (reverse) {// 充分利用尾指针的优势
        index = c_length(list) - index;
        node = list->rear;
    } else {
        node = list->head->next;
    }
    while (i < index) {
        if (reverse) {
            node = node->pre;
        } else {
            node = node->next;
        }
        i++;
    }
    return node->data;
}

// 删除一个元素
int c_delete(CLIST list, unsigned int index) {
    printf("--删除%d位置元素\n", index);
    if (c_length(list) == 0 || index > c_length(list) - 1) {
        return ERROR;
    }
    int i = 0;
    CNODE* node;// node为被删除元素
    int reverse = c_reverse(list, index);
    if (reverse) {
        index = c_length(list) - index;
        node = list->rear;
    } else {
        node = list->head->next;
    }
    while (i < index) {
        if (reverse) {
            node = node->pre;
        } else {
            node = node->next;
        }
        i++;
    }
    if (node == list->rear) list->rear = node->pre;// 尾节点被删除了，重新赋值尾指针
    node->pre->next = node->next;
    node->next->pre = node->pre;
    int data = node->data;
    free(node);
    list->head->data--;
    return data;
}

// 清空
void c_clear(CLIST list) {
    printf("--清空链表\n");
    CNODE* node = list->head;
    while (node->next != list->head) {
        CNODE* nextNode = node->next->next;
        free(node->next);
        node->next = nextNode;
    }
    list->rear = list->head;
    list->head->data = 0;
}
#endif

{% endhighlight %}

测试文件main.c

{% highlight  c%}

//
//  main.c
//  DataStructure
//
//  Created by Jerry Hsia on 11/06/14.
//  Copyright (c) 2014 Jerry Hsia. All rights reserved.
//

#include <stdio.h>
#include <stdlib.h>
#include "Public.h"
#include "DCircLinkList.h"

int main(int argc, const char * argv[]) {
    
    // 头插法
    CLIST circLinkList0 = c_init();
    for (int i = 0; i < 5; i++) {
        c_add(circLinkList0, 0, i);
    }
    c_print(circLinkList0);
    
    // 尾插法
    CLIST circLinkList = c_init();
    for (int i = 0; i < 5; i++) {
        c_add(circLinkList, c_length(circLinkList), i);
    }
    c_print(circLinkList);
    
    c_add(circLinkList, 3, 5);
    c_print(circLinkList);
    
    printf("%d\n", c_get(circLinkList, 5));
    c_print(circLinkList);
    
    c_delete(circLinkList, 1);
    c_print(circLinkList);
    
    c_clear(circLinkList);
    c_print(circLinkList);
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
pre: 5 data: 4 next: 3
pre: 4 data: 3 next: 2
pre: 3 data: 2 next: 1
pre: 2 data: 1 next: 0
pre: 1 data: 0 next: 5
--在0位置插入0
--在1位置插入1
--在2位置插入2
--在3位置插入3
--在4位置插入4
--打印链表，链表长度：5
pre: 5 data: 0 next: 1
pre: 0 data: 1 next: 2
pre: 1 data: 2 next: 3
pre: 2 data: 3 next: 4
pre: 3 data: 4 next: 5
--在3位置插入5
--打印链表，链表长度：6
pre: 6 data: 0 next: 1
pre: 0 data: 1 next: 2
pre: 1 data: 2 next: 5
pre: 2 data: 5 next: 3
pre: 5 data: 3 next: 4
pre: 3 data: 4 next: 6
--获取5位置的元素
3
--打印链表，链表长度：6
pre: 6 data: 0 next: 1
pre: 0 data: 1 next: 2
pre: 1 data: 2 next: 5
pre: 2 data: 5 next: 3
pre: 5 data: 3 next: 4
pre: 3 data: 4 next: 6
--删除1位置元素
--打印链表，链表长度：5
pre: 5 data: 0 next: 2
pre: 0 data: 2 next: 5
pre: 2 data: 5 next: 3
pre: 5 data: 3 next: 4
pre: 3 data: 4 next: 5
--清空链表
--打印链表，链表长度：0

{% endhighlight %}
