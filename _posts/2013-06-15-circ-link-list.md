---
author: Jerry Hsia
title: 循环链表实现
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

StaticLinkList.h

{% highlight  bash%}

//
//  CircLinkList.h
//  DataStructure
//
//  Created by Jerry Hsia on 15/06/13.
//  Copyright (c) 2013 Jerry Hsia. All rights reserved.
//

#ifndef DataStructure_CircLinkList_h
#define DataStructure_CircLinkList_h

#define SUCCESS -1
#define ERROR -2

typedef struct CircLinkListNode {
    int data;
    struct CircLinkListNode* next;
} CNODE;

struct CircLinkList {
    CNODE* rear;
};

typedef struct CircLinkList* CLIST;

CLIST c_init() {
    CLIST circLinkList = (CLIST)malloc(sizeof(CLIST));
    CNODE* node = (CNODE*)malloc(sizeof(CNODE));
    node->next = node;
    circLinkList->rear = node;
    return circLinkList;
}

// 打印链表
void c_print(CLIST list) {
    printf("--c_print\n");
    CNODE* node = list->rear->next;
    while (node->next != list->rear->next) {
        printf("%d\n", node->next->data);
        node = node->next;
    }
}

// 添加一个元素到index位置
int c_add(CLIST list, int index, int number) {
    printf("--在%d位置插入%d\n", index, number);
    int i = 0;
    CNODE* node = list->rear->next;
    while (i <= index) {
        if (i == index) {
            CNODE* newNode = (CNODE*)malloc(sizeof(CNODE));
            newNode->data = number;
            newNode->next = node->next;
            node->next = newNode;
            return SUCCESS;
        }
        node = node->next;
        i++;
    }
    return ERROR;
}

// 获取第index个元素
int c_get(CLIST list, int index) {
    printf("--获取%d位置的元素\n", index);
    CNODE* node = list->rear->next;
    int i = 0;
    while (node->next != list->rear->next && i <= index) {
        if (i == index) {
            return node->next->data;
        }
        node = node->next;
        i++;
    }
    return ERROR;
}

// 删除一个元素
int c_delete(CLIST list, int index) {
    printf("--删除%d位置元素\n", index);
    CNODE* node = list->rear->next;
    int i = 0;
    while (node->next != list->rear->next && i <= index) {
        if (i == index) {
            CNODE* deleteNode = node->next;
            if (deleteNode->next) {
                node->next = deleteNode->next;
            } else {
                node->next = NULL;
            }
            return deleteNode->data;
        }
        node = node->next;
        i++;
    }
    return ERROR;
}

// 清空
void c_clear(CLIST list) {
    printf("--清空链表\n");
    CNODE* head = list->rear->next;
    while (head->next != head) {
        CNODE* nextNode = head->next->next;
        free(head->next);
        head->next = nextNode;
    }
    list->rear = head;
}
#endif

{% endhighlight %}

main.c

{% highlight  c%}

//
//  main.c
//  DataStructure
//
//  Created by Jerry Hsia on 15/06/13.
//  Copyright (c) 2013 Jerry Hsia. All rights reserved.
//

#include <stdio.h>
#include <stdlib.h>
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
    CNODE* head = circLinkList->rear->next;
    for (int i = 0; i < 5; i++) {
        CNODE* node = (CNODE*)malloc(sizeof(CNODE));
        node->data = i;
        circLinkList->rear->next = node;
        node->next = head;
        circLinkList->rear = node;
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

运行结果
{% highlight  bash%}

--在0位置插入0
--在0位置插入1
--在0位置插入2
--在0位置插入3
--在0位置插入4
--c_print
4
3
2
1
0
--c_print
0
1
2
3
4
--在3位置插入5
--c_print
0
1
2
5
3
4
--获取5位置的元素
4
--c_print
0
1
2
5
3
4
--删除1位置元素
--c_print
0
2
5
3
4
--清空链表
--c_print

{% endhighlight %}
