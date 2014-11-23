---
author: Jerry Hsia
title: 静态链表实现
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
//  StaticLinkList.h
//  DataStructure
//
//  Created by Jerry Hsia on 11/06/13.
//  Copyright (c) 2013 Jerry Hsia. All rights reserved.
//

#ifndef DataStructure_StaticLinkList_h
#define DataStructure_StaticLinkList_h

#define SUCCESS -1
#define ERROR -2
#define STATIC_MAX_SIZE 7

typedef struct StaticLinkListNode {
    int data;
    int cur;
} SNODE, StaticLinkList[STATIC_MAX_SIZE];

// 获取下一个可用数组元素位置
int get_next_cur(StaticLinkList list) {
    int cur = list[0].cur;
    if (cur) {
        list[0].cur = list[cur].cur;
    }
    return cur;
}

// 获取链表长度
int s_size(StaticLinkList list) {
    return list[0].data;
}

// 打印链表
void s_print(StaticLinkList list) {
    printf("--s_print_start--\n");
    SNODE node = list[STATIC_MAX_SIZE - 1];
    while (node.cur != 0) {
        printf("%d\n", list[node.cur].data);
        node = list[node.cur];
    }
    printf("--s_print_end--\n");
}

// 打印原始数组
void s_print_array(StaticLinkList list) {
    printf("--s_print_array_start--\n");
    for (int i = 0; i < STATIC_MAX_SIZE; i++) {
        printf("i:%d data:%d cur:%d \n", i, list[i].data, list[i].cur);
    }
    printf("--s_print_array_end--\n");
}

// 添加一个元素
int s_add(StaticLinkList list, int index, int number) {
    if (s_size(list) == STATIC_MAX_SIZE - 2 || index > s_size(list)) return ERROR;
    int i = 0;
    int p = STATIC_MAX_SIZE - 1;
    SNODE node = list[p];
    while (i <= index) {
        if (i == index) {
            int next_cur = get_next_cur(list);
            list[next_cur].data = number;
            list[next_cur].cur  = node.cur;
            list[p].cur = next_cur;
            
            list[0].data++; // 将第一个数组元素的data字段用于存放链表长度
            break;
        }
        p = node.cur;
        node = list[p];
        i++;
    }
    return SUCCESS;
}

// 删除一个元素
int s_delete(StaticLinkList list, int index) {
    if (index > s_size(list) - 1) return ERROR;
    int i = 0;
    int p = STATIC_MAX_SIZE - 1;
    SNODE node = list[p];
    while (i <= index) {
        if (i == index) {
            list[node.cur].data = 0;
            list[p].cur = list[node.cur].cur;
            
            list[node.cur].cur = list[0].cur;
            list[0].cur = node.cur;
            list[0].data--;
        }
        p = node.cur;
        node = list[p];
        i++;
    }
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
//  Created by Jerry Hsia on 11/06/13.
//  Copyright (c) 2013 Jerry Hsia. All rights reserved.
//

#include <stdio.h>
#include <stdlib.h>
#include "StaticLinkList.h"

int main(int argc, const char * argv[]) {
    
    StaticLinkList list;
    
    for (int i = 0; i < STATIC_MAX_SIZE; i++) {
        list[i].cur = i + 1;
        list[i].data = 0;
    }
    
    list[STATIC_MAX_SIZE - 1].cur = 0;
    
    s_add(list, 0, 888);
    s_add(list, 0, 777);
    s_add(list, 0, 666);
    s_add(list, 1, 555);
    
    printf("链表的长度：%d\n", s_size(list));
    s_print(list);
    
    s_delete(list, 2);
    s_print(list);
    
    printf("链表的长度：%d\n", s_size(list));
    s_add(list, s_size(list), 999);
    s_print(list);
    
    return 0;
}


{% endhighlight %}

运行结果
{% highlight  bash%}

链表的长度：4
--s_print_start--
666
555
777
888
--s_print_end--
--s_print_start--
666
777
888
--s_print_end--
链表的长度：3
--s_print_start--
666
777
888
--s_print_end--
--s_print_array_start--
i:0 data:3 cur:4 
i:1 data:888 cur:0 
i:2 data:777 cur:1 
i:3 data:666 cur:2 
i:4 data:0 cur:5 
i:5 data:0 cur:6 
i:6 data:0 cur:3 
--s_print_array_end--s

{% endhighlight %}
