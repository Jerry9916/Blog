---
author: Jerry Hsia
title: 单链表实现
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

SingleLinkList.h

{% highlight  bash%}

//
//  SingleLinkList.h
//  DataStructure
//
//  Created by Jerry Hsia on 11/06/13.
//  Copyright (c) 2013 Jerry Hsia. All rights reserved.
//

#ifndef DataStructure_SingleLinkList_h
#define DataStructure_SingleLinkList_h

typedef struct SingleLinkListNode {
    int data;
    struct SingleLinkListNode* next;
} SNODE;

typedef struct SingleLinkListNode* SLIST;

// 打印单链表
void s_print(SLIST list) {
    SNODE* node = list;
    while (node->next) {
        printf("%d\n", node->next->data);
        node = node->next;
    }
}

// 添加一个元素到index位置
int s_add(SLIST list, int index, int number) {
    int i = 0;
    SNODE* node = list;
    while (node && i <= index) {
        if (i == index) {
            SNODE* newNode = (SNODE*)malloc(sizeof(SNODE));
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
int s_get(SLIST list, int index) {
    SNODE* node = list;
    int i = 0;
    while (i <= index) {
        if (!node) {
            return ERROR;
        }
        node = node->next;
        i++;
    }
    return node->data;
}

// 删除一个元素
int s_delete(SLIST list, int index) {
    SNODE* node = list;
    int i = 0;
    while (i <= index) {
        if (node->next) {
            if (i == index) {
                SNODE* deleteNode = node->next;
                if (deleteNode->next) {
                    node->next = deleteNode->next;
                } else {
                    node->next = NULL;
                }
                return deleteNode->data;
            }
            node = node->next;
            i++;
        } else {
            return ERROR;
        }
    }
    return ERROR;
}

// 清空
void s_clear(SLIST list) {
    SNODE* node = list->next;
    while (node) {
        SNODE* next = node->next;
        free(node);
        node = next;
    }
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
//  Created by Jerry Hsia on 11/06/13.
//  Copyright (c) 2013 Jerry Hsia. All rights reserved.
//
#define SUCCESS -1
#define ERROR -2

#include <stdio.h>
#include <stdlib.h>
#include "SingleLinkList.h"

int main(int argc, const char * argv[]) {
    
    // 头插法
    SLIST singleLinkList0 = (SLIST)malloc(sizeof(SNODE));
    for (int i = 0; i < 5; i++) {
        s_add(singleLinkList0, 0, i);
    }
    
    s_print(singleLinkList0);
    
    // 尾插法
    SLIST singleLinkList = (SLIST)malloc(sizeof(SNODE));
    SNODE* endNode = singleLinkList;
    for (int i = 0; i < 5; i++) {
        SNODE* node = (SNODE*)malloc(sizeof(SNODE));
        node->data = i;
        endNode->next = node;
        endNode = node;
    }
    
    printf("--打印\n");
    s_print(singleLinkList);
    
    printf("--添加一个新元素\n");
    s_add(singleLinkList, 3, 5);
    s_print(singleLinkList);
    
    printf("--获取一个元素\n");
    printf("%d\n", s_get(singleLinkList, 0));
    s_print(singleLinkList);
    
    printf("--删除一个元素\n");
    s_delete(singleLinkList, 1);
    s_print(singleLinkList);
    
    printf("--清空\n");
    s_clear(singleLinkList);
    s_print(singleLinkList);
    
    return 0;
}

{% endhighlight %}
