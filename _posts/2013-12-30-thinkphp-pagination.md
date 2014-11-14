---
author: Jerry Hsia
title: 我改进的ThinkPHP分页类
excerpt:
layout: post
views:
  - 100
category:
  - PHP
tags:
  - PHP
post_format: [ ]
---
ThinkPHP是国内流行的MVC框架，官方的分页类 是把分页的显示字符串硬编码到函数中了，这在MVC开发模式中显然不合适，我在此进行了改进，改进的分页类Page.class.php如下：
{% highlight php %}
<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK IT ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006-2012 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: Jerry <xiajie9916@gmail.com>
// +----------------------------------------------------------------------
// | Blog: www.xiajie.me
// +----------------------------------------------------------------------

class Page {
    // 分页栏每页显示的页数
    public $rollPage = 5;
    // 页数跳转时要带的参数
    public $parameter;
    // 分页URL地址
    public $url = '';
    // 默认列表每页显示行数
    public $listRows = 20;
    // 起始行数
    public $firstRow;
    // 分页总页面数
    public $totalPages;
    // 总行数
    public $totalRows;
    // 当前页数
    public $nowPage;
    // 分页的栏的总页数
    public $coolPages;
    // 默认分页变量名
    public $varPage;
    // 链接地址容器
    public $urls;

    /**
     * 架构函数
     * 
     * @access public
     * @param array $totalRows
     *            总的记录数
     * @param array $listRows
     *            每页显示记录数
     * @param array $parameter
     *            分页跳转的参数
     */
    public function __construct($totalRows, $listRows = '', $parameter = '') {
        $this->totalRows = $totalRows;
        $this->parameter = $parameter;
        $this->varPage = C('VAR_PAGE') ? C('VAR_PAGE') : 'p';
        if (!empty($listRows)) {
            $this->listRows = intval($listRows);
        }
        $this->totalPages = ceil($this->totalRows / $this->listRows); // 总页数
        $this->coolPages = ceil($this->totalPages / $this->rollPage);
        $this->nowPage = !empty($_GET[$this->varPage]) ? intval($_GET[$this->varPage]) : 1;
        if ($this->nowPage < 1) {
            $this->nowPage = 1;
        } elseif (!empty($this->totalPages) && $this->nowPage > $this->totalPages) {
            $this->nowPage = $this->totalPages;
        }
        $this->firstRow = $this->listRows * ($this->nowPage - 1);
        $this->creatUrls();
    }

    /**
     * 生成需要的URL
     * 
     * @return string
     */
    private function creatUrls() {
        if (0 == $this->totalRows)
            return '';
        $p = $this->varPage;
        $nowCoolPage = ceil($this->nowPage / $this->rollPage);
        $url = "";
        if ($this->parameter && is_string($this->parameter)) {
            parse_str($this->parameter, $parameter);
        } elseif (is_array($this->parameter)) {
            $parameter = $this->parameter;
        } elseif (empty($this->parameter)) {
            unset($_GET[C('VAR_URL_PARAMS')]);
            $var = !empty($_POST) ? $_POST : $_GET;
            if (empty($var)) {
                $parameter = array();
            } else {
                $parameter = $var;
            }
        }
        $parameter[$p] = '__PAGE__';
        if (GROUP_NAME) {
            $url = U(GROUP_NAME . "/" . MODULE_NAME . "/" . ACTION_NAME);
        } else {
            $url = U(MODULE_NAME . "/" . ACTION_NAME);
        }
        $parameter = http_build_query($parameter);
        $url = $url . "?" . $parameter;
        $upRow = $this->nowPage - 1;
        $downRow = $this->nowPage + 1;
        $this->urls['up'] = ''; // 上一页链接
        if ($upRow > 0) {
            $this->urls['up'] = str_replace('__PAGE__', $upRow, $url);
        }
        $this->urls['down'] = ''; // 下一页链接
        if ($downRow <= $this->totalPages) {
            $this->urls['down'] = str_replace('__PAGE__', $downRow, $url);
        }
        $this->urls['first'] = ''; // 第1页链接
        $this->urls['preRoll'] = ''; // 上n页链接
        if ($nowCoolPage != 1) {
            $preRow = $this->nowPage - $this->rollPage;
            $this->urls['preRoll'] = str_replace('__PAGE__', $preRow, $url);
            $this->urls['first'] = str_replace('__PAGE__', 1, $url);
        }
        $this->urls['nextRoll'] = ''; // 下n页
        $this->urls['end'] = ''; // 最后页
        if ($nowCoolPage != $this->coolPages) {
            $nextRow = $this->nowPage + $this->rollPage;
            $theEndRow = $this->totalPages;
            $this->urls['nextRoll'] = str_replace('__PAGE__', $nextRow, $url);
            $this->urls['end'] = str_replace('__PAGE__', $theEndRow, $url);
        }
        // 页码链接
        $this->urls['nums'] = array();
        for ($i = 1; $i <= $this->rollPage; $i++) {
            $page = ($nowCoolPage - 1) * $this->rollPage + $i;
            if ($page <= $this->totalPages) {
                $this->urls['nums'][$page] = str_replace('__PAGE__', $page, $url);
            } else {
                break;
            }
        }
    }
}
{% endhighlight %}
控制器Action测试代码：
{% highlight php %}
<?php
import('ORG.Util.Page');// 导入分页类
$count = 100;// 这里是结果总数，一般是查询数据库表得到
$Page = new Page($count,10);// 实例化分页类 传入总记录数和每页显示的记录数
$this->assign('page',$Page);//将分页对象传入模板
{% endhighlight %}
有了模版中有了page对象后，就可以任意发挥啦：
{% highlight html %}
共有{$page:totalRows}条记录，每页{$page:listRows}条 页码：{$page:nowPage}/{$page:totalPages}
<!--{neq name="page:urls['first']" value=""}-->
  <a href="{$page->urls['first']}">首页</a>
<!--{/neq}-->
<!--{neq name="page:urls['preRoll']" value=""}-->
    <a href="{$page->urls['preRoll']}">前{$page:rollPage}页</a>
<!--{/neq}-->
<!--{neq name="page:urls['up']" value=""}-->
   <a href="{$page->urls['up']}">上一页</a>
<!--{/neq}-->
<!--{volist name="page:urls['nums']" id="data"}-->
&nbsp;&nbsp; &nbsp;<a href="{$data}" <!--{eq name="page:nowPage" value="$key"}--> style="font-weight:bold;"<!--{/eq}-->>{$key}</a>
<!--{/volist}-->
<!--{neq name="page:urls['down']" value=""}-->
   <a href="{$page->urls['down']}">下一页</a>
<!--{/neq}-->
<!--{neq name="page:urls['nextRoll']" value=""}-->
   <a href="{$page->urls['nextRoll']}">后{$page:rollPage}页</a>
<!--{/neq}-->
<!--{neq name="page:urls['end']" value=""}-->
 <a href="{$page->urls['end']}">尾页</a>
<!--{/neq}-->
{% endhighlight %}
注意：我使用的模版标签格式是<!—->，别忘了换成你的哦！

是不是更灵活、更好用了呢，当然适合自己的才是最好的，大家可以根据自己的喜好DIY吧！
