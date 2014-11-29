---
author: Jerry Hsia
title: 循环链表
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

循环链表在单链表的基础上使最后一个节点(也称尾节点)指向头节点形成闭环。

![](/files/2014/circ-link-list.png)

优点

- 存储空间不受限制
- 插入、删除时间复杂度O(1)

缺点

- 查找时间复杂度O(n)，尾节点O(1)

### 实战篇

头文件CircLinkList.h

{% highlight  c%}

//
//  CircLinkList.h
//  DataStructure
//
//  Created by Jerry Hsia on 11/05/14.
//  Copyright (c) 2014 Jerry Hsia. All rights reserved.
//

#ifndef DataStructure_CircLinkList_h
#define DataStructure_CircLinkList_h

typedef struct CircLinkListNode {
    int data;
    struct CircLinkListNode* next;
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
    circLinkList->rear = head;// 尾指针指向头结点
    circLinkList->head = head;
    return circLinkList;
}

// 获取链表长度
int c_length(CLIST list) {
    return list->head->data;
}

// 打印链表
void c_print(CLIST list) {
    printf("--打印链表，链表长度：%d\n", c_length(list));
    CNODE* node = list->head;
    while (node->next != list->head) {
        printf("%d\n", node->next->data);
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
    int i;
    CNODE* node;
    if (index == c_length(list)) {// 在末尾插入，直接在尾节点后插入，时间复杂度O(1)
        node = list->rear;
        i = c_length(list);
        list->rear = newNode;// 尾指针指向新节点
    } else {
        node = list->head;
        i = 0;
    }
    while (i < index) {
        node = node->next;
        i++;
    }
    newNode->next = node->next;
    node->next = newNode;
    list->head->data++;
    return SUCCESS;
}

// 获取第index个元素
int c_get(CLIST list, unsigned int index) {
    printf("--获取%d位置的元素\n", index);
    if (c_length(list) == 0 || index > c_length(list) - 1) {
        return ERROR;
    }
    CNODE* node;
    int i;
    if (index == c_length(list) - 1) {// 充分利用尾指针的优势
        node = list->rear;
        i = c_length(list) - 1;
    } else {
        i = 0;
        node = list->head->next;
    }
    while (i < index) {
        node = node->next;
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
    CNODE* node = list->head;
    while (i < index) {
        node = node->next;
        i++;
    }
    CNODE* deleteNode = node->next;
    if (deleteNode == list->rear) list->rear = node;// 尾节点被删除了，重新赋值尾指针
    node->next = deleteNode->next;
    int data = deleteNode->data;
    free(deleteNode);
    list->head->data--;
    return data;
}

// 清空
int c_clear(CLIST list) {
    printf("--清空链表\n");
    if (c_length(list) == 0) return ERROR;
    CNODE* node = list->head;
    while (node->next != list->head) {
        CNODE* nextNode = node->next->next;
        free(node->next);
        node->next = nextNode;
    }
    list->rear = list->head;
    list->head->data = 0;
    return SUCCESS;
}
#endif

{% endhighlight %}

测试文件main.c

{% highlight  c%}

//
//  main.c
//  DataStructure
//
//  Created by Jerry Hsia on 11/05/14.
//  Copyright (c) 2014 Jerry Hsia. All rights reserved.
//

#include <stdio.h>
#include <stdlib.h>
#include "Public.h"
#include "CircLinkList.h"

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

--在0位置插入0--
--在0位置插入1--
--在0位置插入2--
--在0位置插入3--
--在0位置插入4--
--打印链表，链表长度：5--
4
3
2
1
0
--在0位置插入0--
--在1位置插入1--
--在2位置插入2--
--在3位置插入3--
--在4位置插入4--
--打印链表，链表长度：5--
0
1
2
3
4
--在3位置插入5--
--打印链表，链表长度：6--
0
1
2
5
3
4
--获取5位置的元素
4
--打印链表，链表长度：6--
0
1
2
5
3
4
--删除1位置元素
--打印链表，链表长度：5--
0
2
5
3
4
--清空链表
--打印链表，链表长度：0--

{% endhighlight %}
